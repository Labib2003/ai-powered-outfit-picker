import { categoryRouter } from "./routers/category.router";
import { productRouter } from "./routers/product.router";
import { router } from "./trpc";

export const appRouter = router({
  category: categoryRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
