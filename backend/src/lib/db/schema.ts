import { pgTable, timestamp, varchar, uuid, text, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const tables = pgTable('tables', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: integer('number').notNull(),
});

export type NewTable = typeof tables.$inferInsert;

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code'),
  category: text('category'),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type NewProduct = typeof tables.$inferInsert;

export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: text('option_name'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
})

export type NewProductVariant = typeof productVariants.$inferInsert;

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  tableId: uuid('table_id')
    .notNull()
    .references(() =>tables.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull(),
  // open | paid | canceled
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});

export type NewOrder = typeof orders.$inferInsert;

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id')
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  qty: integer('qty').notNull(),
  priceAtOrder: numeric('price_at_order', { precision: 10, scale: 2 }).notNull(),
});

export type NewOrderItem = typeof orderItems.$inferInsert;
