import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { GoogleReview, googleReviews, googleReviewSync, InsertUser, themeHighlights, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listThemeHighlights() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(themeHighlights).orderBy(asc(themeHighlights.displayOrder), asc(themeHighlights.id));
}

export async function replaceThemeHighlights(themeSlugs: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para salvar os destaques.");

  await db.transaction(async (tx) => {
    await tx.delete(themeHighlights);
    if (themeSlugs.length > 0) {
      await tx.insert(themeHighlights).values(themeSlugs.map((themeSlug, index) => ({
        themeSlug,
        displayOrder: index + 1,
      })));
    }
  });

  return listThemeHighlights();
}

export async function getGoogleReviewsAdminData() {
  const db = await getDb();
  if (!db) {
    return { status: "not_connected" as const, reviews: [] as GoogleReview[] };
  }

  const syncRows = await db.select().from(googleReviewSync).orderBy(asc(googleReviewSync.id)).limit(1);
  const sync = syncRows[0];
  const reviews = await db.select().from(googleReviews).orderBy(asc(googleReviews.publishedAt));

  if (!sync || sync.status === "not_connected") {
    return { status: "not_connected" as const, reviews: [] as GoogleReview[], profileName: sync?.profileName ?? undefined };
  }

  if (sync.status === "error") {
    return { status: "error" as const, reviews: [] as GoogleReview[], errorMessage: sync.errorMessage ?? "A integração do Google não conseguiu sincronizar as avaliações." };
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : undefined;
  return {
    status: "connected" as const,
    reviews,
    profileName: sync.profileName ?? undefined,
    lastSyncedAt: sync.lastSyncedAt ?? undefined,
    totalReviews,
    averageRating,
  };
}
