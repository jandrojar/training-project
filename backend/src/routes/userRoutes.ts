import Router from "@koa/router";
import {registerHandler, getCurrentUserHandler} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const userRouter = new Router({
    prefix: "/users",
});

userRouter.post("/register", registerHandler);
userRouter.get("/me", authMiddleware, getCurrentUserHandler);

export default userRouter;

