import { authRouter } from "@/lib/api/routers/auth";
import { createCallerFactory, createTRPCRouter } from "@/lib/api/trpc";
import { todosRouter } from "./routers/todos";
import { workspacesRouter } from "./routers/workspaces";
import { labelsRouter } from "./routers/labels";
import { projectsRouter } from "./routers/projects";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	todos: todosRouter,
	workspaces: workspacesRouter,
	labels: labelsRouter,
	projects: projectsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
