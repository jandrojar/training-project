import Router from "@koa/router";
import {
  createProjectHandler,
  getProjectsHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
  getFilteredProjectsHandler,
} from "../controllers/projectController";
import { authMiddleware } from "../middleware/authMiddleware";

const projectsRouter = new Router({ prefix: "/projects" });

projectsRouter.use(authMiddleware);

projectsRouter.get("/", getFilteredProjectsHandler);
projectsRouter.get("/:id", getProjectHandler);
projectsRouter.post("/", createProjectHandler);
projectsRouter.put("/:id", updateProjectHandler);
projectsRouter.delete("/:id", deleteProjectHandler);

export default projectsRouter;
