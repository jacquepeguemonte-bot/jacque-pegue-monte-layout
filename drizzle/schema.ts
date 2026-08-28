import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** Seleção editorial de temas exibidos em primeiro no site público. */
export const themeHighlights = mysqlTable("theme_highlights", {
  id: int("id").autoincrement().primaryKey(),
  themeSlug: varchar("themeSlug", { length: 128 }).notNull(),
  displayOrder: int("displayOrder").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  themeSlugUnique: uniqueIndex("theme_highlights_theme_slug_unique").on(table.themeSlug),
}));

export type ThemeHighlight = typeof themeHighlights.$inferSelect;

/** Estado da integração oficial com o Google Business Profile. */
export const googleReviewSync = mysqlTable("google_review_sync", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["not_connected", "connected", "error"]).default("not_connected").notNull(),
  profileName: varchar("profileName", { length: 255 }),
  lastSyncedAt: timestamp("lastSyncedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Avaliações reais recebidas pela integração oficial; nunca é populada com dados fictícios. */
export const googleReviews = mysqlTable("google_reviews", {
  id: int("id").autoincrement().primaryKey(),
  reviewId: varchar("reviewId", { length: 255 }).notNull().unique(),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  reviewerPhotoUrl: text("reviewerPhotoUrl"),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  publishedAt: timestamp("publishedAt").notNull(),
  updatedAt: timestamp("updatedAt"),
  reply: text("reply"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GoogleReviewSync = typeof googleReviewSync.$inferSelect;
export type GoogleReview = typeof googleReviews.$inferSelect;
