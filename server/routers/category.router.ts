import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { eq, count, desc, or, like, and } from "drizzle-orm";
import dbErrorHandler from "../utils/dbErrorHandler";
import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema/category";

export const userRouter = router({
  // READ (Paginated list)
  list: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(50).default(10),
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const offset = (page - 1) * limit;

      // Build dynamic WHERE clause
      const conditions = [];

      if (input?.search) {
        const searchableFields = ["name", "description"] as const;
        const term = `%${input.search}%`;
        conditions.push(
          or(
            ...searchableFields.map((field) =>
              like(
                categoryTable[field as (typeof searchableFields)[number]],
                term,
              ),
            ),
          ),
        );
      }

      const whereClause = conditions.length ? and(...conditions) : undefined;

      try {
        // Query paginated users
        const categories = await db
          .select()
          .from(categoryTable)
          .where(whereClause)
          .limit(limit)
          .offset(offset)
          .orderBy(desc(categoryTable.createdAt));

        // Count total for pagination
        const [{ count: total }] = await db
          .select({ count: count() })
          .from(categoryTable)
          .where(whereClause);

        return {
          data: categories,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        dbErrorHandler(error);
      }
    }),

  // READ (Single)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const [user] = await db
          .select()
          .from(categoryTable)
          .where(eq(categoryTable.id, input.id));

        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        dbErrorHandler(error);
      }
    }),
});
