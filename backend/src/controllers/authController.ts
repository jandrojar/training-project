import { Context } from "koa";
import { login, logout } from "../services/authService";
import { getBearerToken } from "../middleware/authMiddleware";
import { BadRequestError } from "../errors/AppError";

export async function loginHandler(ctx: Context) {
  const { email, password } = ctx.request.body as { email?: string; password?: string };

  if (!email || !password) {
    throw new BadRequestError("Missing credentials", "missing-credentials");
  }

  ctx.body = await login(email, password);
}

export async function logoutHandler(ctx: Context) {
  const token = getBearerToken(ctx);

  if (!token) {
    throw new BadRequestError(
      "Missing or invalid Authorization header",
      "missing-or-invalid-authorization-header",
    );
  }

  await logout(token);
  ctx.body = { success: true };
}
