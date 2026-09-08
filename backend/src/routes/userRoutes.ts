import Router from "@koa/router";
import {
  registerHandler,
  getCurrentUserHandler,
  updateCurrentUserHandler,
  updatePasswordHandler,
  deleteCurrentUserHandler,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = new Router({
  prefix: "/users",
});

userRouter.post("/register", registerHandler);
userRouter.get("/me", authMiddleware, getCurrentUserHandler);
userRouter.patch("/me", authMiddleware, updateCurrentUserHandler);
userRouter.patch("/me/password", authMiddleware, updatePasswordHandler);
userRouter.delete("/me", authMiddleware, deleteCurrentUserHandler);

export default userRouter;
