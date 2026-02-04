import Router from "@koa/router";
import {registerHandler, getCurrentUserHandler, updateCurrentUserHandler} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = new Router({
    prefix: "/users",
});

userRouter.post("/register", registerHandler);
userRouter.get("/me", authMiddleware, getCurrentUserHandler);
userRouter.patch("/me", authMiddleware, updateCurrentUserHandler);

export default userRouter;

