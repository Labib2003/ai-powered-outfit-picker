import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { eq, desc } from "drizzle-orm";
import dbErrorHandler from "../utils/dbErrorHandler";
import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema/category";

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    try {
      // Query paginated users
      const categories = await db
        .select()
        .from(categoryTable)
        .orderBy(desc(categoryTable.createdAt));

      return categories;
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
