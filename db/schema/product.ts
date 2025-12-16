import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { categoryTable } from "./category";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: uuid("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  description: varchar("description").notNull(),
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

const productSelectSchema = createSelectSchema(productsTable).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Product = z.infer<typeof productSelectSchema>;
