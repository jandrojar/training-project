import Router from "@koa/router";
import {registerHandler} from "../controllers/userController";

const userRouter = new Router({
    prefix: "/users",
});

userRouter.post("/register", registerHandler);

export default userRouter;

