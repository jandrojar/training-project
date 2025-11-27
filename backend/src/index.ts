import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import authRouter from './routes/authRoutes';
import userRouter from "./routes/userRoutes";

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "API is running";
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
