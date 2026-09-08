import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import projectsRouter from "./routes/projectRoutes";
import tasksRouter from "./routes/taskRoutes";
import cors from "@koa/cors";
import { errorHandler } from "./middleware/errorHandler";

const app = new Koa();
const router = new Router();
const allowedOrigin = process.env.CORS_ORIGIN || "*";

app.use(errorHandler);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

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

app.use(tasksRouter.routes());
app.use(tasksRouter.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
