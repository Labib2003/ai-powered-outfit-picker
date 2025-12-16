import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoryTable = pgTable("categories", {
  id: uuid().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  description: varchar("description").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date()),
});

const categorySelectSchema = createSelectSchema(categoryTable).extend({
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Category = z.infer<typeof categorySelectSchema>;
