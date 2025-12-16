import {
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { categoryTable } from "./category";

export const sizesEnum = pgEnum("sizes", ["S", "M", "L", "XL"]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  description: varchar("description").notNull(),
  availableSizes: sizesEnum("available_sizes").array().notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),

  categoryId: uuid("category_id")
    .references(() => categoryTable.id)
    .notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date()),
});
