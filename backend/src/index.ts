import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import authRouter from './routes/authRoutes';
import userRouter from "./routes/userRoutes";
import projectsRouter from "./routes/projectRoutes";
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));

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

app.use(projectsRouter.routes());
app.use(projectsRouter.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
