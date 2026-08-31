import type { Express, Request, Response } from "express";
import crypto from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { googleReviews, googleReviewSync } from "../drizzle/schema";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://mybusiness.googleapis.com/v4";
const STATE_COOKIE = "google_business_oauth_state";
const REDIRECT_PATH = "/api/google/oauth/callback";
const OAUTH_SCOPE = "https://www.googleapis.com/auth/business.manage";

function redirectUri(req: Request) {
  const configuredOrigin = process.env.GOOGLE_OAUTH_REDIRECT_ORIGIN;
  const origin = configuredOrigin || `${req.protocol}://${req.get("host")}`;
  return `${origin}${REDIRECT_PATH}`;
}

function encrypt(value: string) {
  const key = crypto.createHash("sha256").update(ENV.cookieSecret || "google-oauth-fallback").digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("base64url")}.${cipher.getAuthTag().toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decrypt(value: string) {
  const [ivText, tagText, dataText] = value.split(".");
  const key = crypto.createHash("sha256").update(ENV.cookieSecret || "google-oauth-fallback").digest();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataText, "base64url")), decipher.final()]).toString("utf8");
}

function parseCookies(req: Request) {
  return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((part) => {
    const index = part.indexOf("=");
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }));
}

async function googleFetch<T>(url: string, accessToken: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { authorization: `Bearer ${accessToken}`, ...(init?.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || body?.error_description || `Google API error ${response.status}`);
  return body as T;
}

async function syncReviews(accessToken: string, refreshTokenCiphertext: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");
  const accounts = await googleFetch<{ accounts?: Array<{ name: string; accountName?: string }> }>("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", accessToken);
  const account = accounts.accounts?.[0];
  if (!account) throw new Error("Nenhuma conta do Perfil da Empresa foi encontrada para esta autorização.");
  const locations = await googleFetch<{ locations?: Array<{ name: string; title?: string }> }>(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title&pageSize=100`, accessToken);
  const location = locations.locations?.[0];
  if (!location) throw new Error("Nenhuma localização foi encontrada na conta autorizada.");
  const reviews = await googleFetch<{ reviews?: Array<{ reviewId?: string; reviewer?: { displayName?: string; profilePhotoUrl?: string }; starRating?: string; comment?: string; createTime?: string; updateTime?: string; reviewReply?: { comment?: string } }> }>(`${API_BASE}/${location.name}/reviews`, accessToken);
  const rows = (reviews.reviews || []).filter((review) => review.reviewId && review.comment).map((review) => ({
    reviewId: review.reviewId!, reviewerName: review.reviewer?.displayName || "Cliente do Google", reviewerPhotoUrl: review.reviewer?.profilePhotoUrl || null,
    rating: ({ ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as Record<string, number>)[review.starRating || ""] || 0,
    comment: review.comment!, publishedAt: new Date(review.createTime || Date.now()), updatedAt: review.updateTime ? new Date(review.updateTime) : null, reply: review.reviewReply?.comment || null,
  }));
  await db.transaction(async (tx) => {
    await tx.delete(googleReviews);
    if (rows.length) await tx.insert(googleReviews).values(rows);
    const existing = await tx.select({ id: googleReviewSync.id }).from(googleReviewSync).orderBy(asc(googleReviewSync.id)).limit(1);
    const values = { status: "connected" as const, profileName: location.title || location.name, accountId: account.name, locationId: location.name, refreshTokenCiphertext, lastSyncedAt: new Date(), errorMessage: null };
    if (existing[0]) await tx.update(googleReviewSync).set(values).where(eq(googleReviewSync.id, existing[0].id));
    else await tx.insert(googleReviewSync).values(values);
  });
}

export function registerGoogleBusinessProfileRoutes(app: Express) {
  app.get("/api/google/connect", (req, res) => {
    if (!ENV.googleOAuthClientId || !ENV.googleOAuthClientSecret) return res.status(503).send("OAuth do Google não configurado.");
    const state = crypto.randomBytes(24).toString("base64url");
    res.setHeader("Set-Cookie", `${STATE_COOKIE}=${encodeURIComponent(state)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
    const params = new URLSearchParams({ client_id: ENV.googleOAuthClientId, redirect_uri: redirectUri(req), response_type: "code", access_type: "offline", prompt: "consent", scope: OAUTH_SCOPE, state });
    res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
  });

  app.get(REDIRECT_PATH, async (req: Request, res: Response) => {
    try {
      const cookies = parseCookies(req);
      if (!req.query.state || req.query.state !== cookies[STATE_COOKIE]) return res.status(400).send("Estado OAuth inválido.");
      if (typeof req.query.code !== "string") return res.status(400).send("Código OAuth ausente.");
      const tokenResponse = await fetch(GOOGLE_TOKEN_URL, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: ENV.googleOAuthClientId, client_secret: ENV.googleOAuthClientSecret, code: req.query.code, grant_type: "authorization_code", redirect_uri: redirectUri(req) }) });
      const tokens = await tokenResponse.json() as { access_token?: string; refresh_token?: string; error?: string; error_description?: string };
      if (!tokenResponse.ok || !tokens.access_token || !tokens.refresh_token) throw new Error(tokens.error_description || tokens.error || "O Google não retornou os tokens necessários.");
      await syncReviews(tokens.access_token, encrypt(tokens.refresh_token));
      res.redirect("/admin/avaliacoes?google=connected");
    } catch (error) {
      const db = await getDb();
      if (db) {
        const existing = await db.select({ id: googleReviewSync.id }).from(googleReviewSync).orderBy(asc(googleReviewSync.id)).limit(1);
        const values = { status: "error" as const, errorMessage: error instanceof Error ? error.message : "Falha ao conectar ao Google." };
        if (existing[0]) await db.update(googleReviewSync).set(values).where(eq(googleReviewSync.id, existing[0].id));
        else await db.insert(googleReviewSync).values(values);
      }
      res.redirect("/admin/avaliacoes?google=error");
    }
  });
}

export { decrypt };
