import { Context, Next } from "koa";
import SessionRepository from "../repositories/SessionRepository";

const sessionRepo = new SessionRepository();

export async function authMiddleware(ctx: Context, next: Next) {
  const rawAuth = ctx.headers["authorization"];

  if (!rawAuth || typeof rawAuth !== "string" || !rawAuth.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { error: "missing-or-invalid-authorization-header" };
    return;
  }

  const sessionId = rawAuth.replace("Bearer ", "").trim();

  const session = await sessionRepo.findSessionById(sessionId);

  if (!session) {
    ctx.status = 401;
    ctx.body = { error: "invalid-session" };
    return;
  }

  const now = new Date();
  if (session.expiresAt < now) {
    ctx.status = 401;
    ctx.body = { error: "session-expired" };
    return;
  }

  ctx.state.userId = session.userId;

  await next();
}