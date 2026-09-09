import Router from "@koa/router";
import { loginHandler, logoutHandler } from "../controllers/authController";

const authRouter = new Router({
  prefix: "/auth",
});

authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);

export default authRouter;
