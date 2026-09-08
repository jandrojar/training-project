import { Context, Next } from "koa";
import { AppError } from "../errors/AppError";

/**
 * Outermost middleware: turns anything thrown downstream into a consistent
 * `{ error: { code, message } }` body. Controllers and services just throw;
 * they never set an error status by hand.
 */
export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.statusCode;
      ctx.body = { error: { code: err.code, message: err.message } };
      return;
    }

    console.error("Unhandled error:", err);
    ctx.status = 500;
    ctx.body = { error: { code: "internal-error", message: "Internal server error" } };
  }
}
