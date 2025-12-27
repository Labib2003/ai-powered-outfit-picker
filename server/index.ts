import { categoryRouter } from "./routers/category.router";
import { productRouter } from "./routers/product.router";
import { searchRouter } from "./routers/search.router";
import { router } from "./trpc";

export const appRouter = router({
  category: categoryRouter,
  product: productRouter,
  search: searchRouter,
});

export type AppRouter = typeof appRouter;
