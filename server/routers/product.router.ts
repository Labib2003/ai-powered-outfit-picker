import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import {
  eq,
  count,
  desc,
  or,
  and,
  inArray,
  gte,
  lte,
  asc,
  ilike,
} from "drizzle-orm";
import dbErrorHandler from "../utils/dbErrorHandler";
import { productsTable } from "@/db/schema/product";
import { db } from "@/db/drizzle";

export const productRouter = router({
  // READ (Paginated list)
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),

        search: z.string().optional(),

        category: z.array(z.string()).optional(),

        priceMin: z.number().optional(),
        priceMax: z.number().optional(),

        sort: z.enum(["newest", "price-low", "price-high"]).optional(),
      }),
    )
    .query(async ({ input }) => {
      const page = input.page;
      const limit = input.limit;
      const offset = (page - 1) * limit;

      const conditions = [];

      /* ===== Search ===== */
      if (input.search) {
        const term = `%${input.search}%`;
        conditions.push(
          or(
            ilike(productsTable.name, term),
            ilike(productsTable.description, term),
          ),
        );
      }

      /* ===== Categories ===== */
      if (input.category?.length) {
        conditions.push(inArray(productsTable.categoryId, input.category));
      }

      /* ===== Price range ===== */
      if (input.priceMin !== undefined) {
        conditions.push(gte(productsTable.price, input.priceMin.toFixed(2)));
      }

      if (input.priceMax !== undefined) {
        conditions.push(lte(productsTable.price, input.priceMax.toFixed(2)));
      }

      const whereClause = conditions.length ? and(...conditions) : undefined;

      /* ===== Sort ===== */
      const orderBy =
        input.sort === "price-low"
          ? asc(productsTable.price)
          : input.sort === "price-high"
            ? desc(productsTable.price)
            : desc(productsTable.createdAt); // newest (default)

      try {
        const data = await db
          .select()
          .from(productsTable)
          .where(whereClause)
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset);

        const [{ count: total }] = await db
          .select({ count: count() })
          .from(productsTable)
          .where(whereClause);

        return {
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        throw dbErrorHandler(error);
      }
    }),

  // READ (Single)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const [user] = await db
          .select()
          .from(productsTable)
          .where(eq(productsTable.id, input.id));

        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        throw dbErrorHandler(error);
      }
    }),
});
