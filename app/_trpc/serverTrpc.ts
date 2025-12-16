import { appRouter } from "@/server";
import { httpBatchLink } from "@trpc/client";

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    // Running on Vercel
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development
  return "http://localhost:3000";
};

export const serverTrpc = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
});
