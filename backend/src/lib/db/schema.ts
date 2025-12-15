import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    username: varchar("username", { length: 256 }).unique().notNull(),
    role: varchar("role", { length: 256 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 256 }).notNull()
})

export type NewUser = typeof users.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at")
})

export type NewRefreshToken = typeof refreshTokens.$inferInsert;