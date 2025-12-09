import Router from "@koa/router";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  getTasksHandler,
  updateTaskDoneHandler,
  updateTaskHandler,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const tasksRouter = new Router({ prefix: "/projects/:projectId/tasks" });

tasksRouter.use(authMiddleware);

tasksRouter.get("/", getTasksHandler);
tasksRouter.get("/:taskId", getTaskHandler);
tasksRouter.post("/", createTaskHandler);
tasksRouter.put("/:taskId", updateTaskHandler);
tasksRouter.delete("/:taskId", deleteTaskHandler);
tasksRouter.patch("/:taskId/done", updateTaskDoneHandler);

export default tasksRouter;
