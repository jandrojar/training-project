import { Context, Next } from "koa";
import SessionRepository from "../repositories/SessionRepository";
import { SESSION_TTL_MS, RENEW_WINDOW_MS } from "../config/auth";
import { UnauthorizedError } from "../errors/AppError";

const sessionRepo = new SessionRepository();

/** Extract the bearer token from the Authorization header, or null. */
export function getBearerToken(ctx: Context): string | null {
  const rawAuth = ctx.headers["authorization"];
  if (typeof rawAuth !== "string" || !rawAuth.startsWith("Bearer ")) {
    return null;
  }
  return rawAuth.slice("Bearer ".length).trim() || null;
}

export async function authMiddleware(ctx: Context, next: Next) {
  const sessionId = getBearerToken(ctx);

  if (!sessionId) {
    throw new UnauthorizedError(
      "Missing or invalid Authorization header",
      "missing-or-invalid-authorization-header",
    );
  }

  const session = await sessionRepo.findSessionById(sessionId);

  if (!session) {
    throw new UnauthorizedError("Session not found", "invalid-session");
  }

  const now = new Date();
  if (session.expiresAt < now) {
    throw new UnauthorizedError("Session has expired", "session-expired");
  }

  const msLeft = session.expiresAt.getTime() - now.getTime();
  if (msLeft <= RENEW_WINDOW_MS) {
    const newExpiresAt = new Date(now.getTime() + SESSION_TTL_MS);
    await sessionRepo.updateSessionExpiry(sessionId, newExpiresAt);
    session.expiresAt = newExpiresAt;
  }

  ctx.state.userId = session.userId;
  ctx.state.sessionId = session.id;

  await next();
}
