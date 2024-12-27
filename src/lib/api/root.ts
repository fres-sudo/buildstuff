import { authRouter } from "@/lib/api/routers/auth";
import { createCallerFactory, createTRPCRouter } from "@/lib/api/trpc";
import { todosRouter } from "./routers/todos";
import { workspacesRouter } from "./routers/workspaces";
import { labelsRouter } from "./routers/labels";
import { projectsRouter } from "./routers/projects";
import { tasksRouter } from "./routers/tasks";
import { an } from "node_modules/better-auth/dist/auth-CfxMSdnJ";
import { analyticsRouter } from "./routers/analytics";
import { timeEntriesRouter } from "./routers/timeEntries";

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
	tasks: tasksRouter,
	analytics: analyticsRouter,
	timeEntries: timeEntriesRouter,
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
