import { DrizzleError, DrizzleQueryError } from "drizzle-orm";

function dbErrorHandler(error: any): string {
  if (error instanceof DrizzleError || error instanceof DrizzleQueryError) {
    // @ts-ignore detail exists in cause
    return error.cause?.detail || "An unexpected error occurred.";
  } else if (error instanceof Error) {
    return error.message;
  }

  // Final fallback for unknown error types
  return "An unknown error occurred.";
}

export default dbErrorHandler;
