import Router from "@koa/router";
import {createProjectHandler, getProjectsHandler, getProjectHandler, updateProjectHandler, deleteProjectHandler} from "../controllers/projectController";
import { authMiddleware } from "../middleware/authMiddleware";

const projectsRouter = new Router({ prefix: '/projects'});

projectsRouter.use(authMiddleware);

projectsRouter.get('/', getProjectsHandler);
projectsRouter.get('/:id', getProjectHandler);
projectsRouter.post('/', createProjectHandler);
projectsRouter.put('/:id', updateProjectHandler);
projectsRouter.delete('/:id', deleteProjectHandler);

export default projectsRouter;