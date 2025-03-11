import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import {
	and,
	asc,
	count,
	desc,
	eq,
	exists,
	gt,
	gte,
	ilike,
	inArray,
	lte,
} from "drizzle-orm";
import { projectMembers, tasks, taskStatuses, todos } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst, takeFirstOrThrow } from "@/lib/utils";
import { newTaskSchema, newTodoSchema } from "@/lib/db/zod.schema";
import { getTodosSchema } from "@/lib/data-table/todos-cached-search";
import { Todo } from "@/lib/db/schema.types";
import { workspacesRouter } from "./workspaces";

export const tasksRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newTaskSchema)
		.mutation(async ({ ctx, input }) => {
			const status = await ctx.db.query.taskStatuses.findFirst({
				where: and(
					eq(taskStatuses.projectId, input.projectId ?? ""),
					eq(taskStatuses.isDefault, true)
				),
			});
			return await ctx.db
				.insert(tasks)
				.values({
					...input,
					statusId: status?.id,
				})
				.returning()
				.then(takeFirstOrThrow);
		}),
	listCalendar: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				mode: z.enum(["day", "week", "month"]),
				from: z.date(),
				to: z.date(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { projectId, mode, from, to } = input;

			const task = await ctx.db.query.tasks.findMany({
				where: and(
					eq(tasks.projectId, projectId),
					gte(tasks.from, from),
					lte(tasks.to, to)
				),
				with: {
					status: true,
				},
			});
			return task.map((task) => ({
				id: task.id,
				title: task.title,
				color: task.status?.color || "blue",
				start: task.from ?? new Date(),
				end: task.to ?? new Date(),
			}));
		}),
	list: protectedProcedure
		.input(getTodosSchema)
		.query(async ({ ctx, input }) => {
			const offset = (input.page - 1) * input.perPage;
			const fromDate = input.from ? new Date(input.from) : undefined;
			const toDate = input.to ? new Date(input.to) : undefined;

			const where = and(
				input.title ? ilike(todos.title, `%${input.title}%`) : undefined,
				input.status.length > 0
					? inArray(todos.status, input.status)
					: undefined,
				input.priority.length > 0
					? inArray(todos.priority, input.priority)
					: undefined,
				fromDate ? gte(todos.createdAt, fromDate) : undefined,
				toDate ? lte(todos.createdAt, toDate) : undefined
			);

			const orderBy =
				input.sort.length > 0
					? input.sort.map((item) =>
							item.desc
								? desc(
										todos[
											item.id as "priority" | "status" | "title" | "createdAt"
										]
									)
								: asc(
										todos[
											item.id as "priority" | "status" | "title" | "createdAt"
										]
									)
						)
					: [asc(todos.createdAt)];
			const { data, total } = await new Promise<{
				data: Todo[];
				total: number;
			}>(async (resolve, reject) => {
				try {
					const data = await ctx.db
						.select()
						.from(todos)
						.limit(input.perPage)
						.offset(offset)
						.where(where)
						.orderBy(...orderBy);

					const total = await ctx.db
						.select({
							count: count(),
						})
						.from(todos)
						.where(where)
						.execute()
						.then((res) => res[0]?.count ?? 0);

					resolve({ data, total });
				} catch (error) {
					reject(error);
				}
			});

			const pageCount = Math.ceil(total / input.perPage);
			return { data, pageCount };
		}),
	search: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				projectId: z.string(),
				query: z.string(),
				limit: z.number().default(10),
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.db.query.tasks.findMany({
				where: and(
					exists(
						ctx.db
							.select()
							.from(projectMembers)
							.where(
								and(
									eq(projectMembers.projectId, input.projectId),
									eq(projectMembers.userId, ctx.session?.user.id)
								)
							)
					),
					eq(tasks.assigneeId, ctx.session?.user.id),
					ilike(tasks.code, `%${input.query}%`)
				),
				limit: input.limit,
			});
		}),
	update: protectedProcedure
		.input(newTaskSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db
				.update(tasks)
				.set(input)
				.where(eq(todos.id, input.id ?? ""))
				.returning()
				.then(takeFirst);
		}),
	updateStatus: protectedProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
				status: z.enum(["todo", "in-progress", "done", "canceled"]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { ids, status } = input;

			const updatedTodos = await ctx.db
				.update(todos)
				.set({ status })
				.where(inArray(todos.id, ids))
				.returning();

			return updatedTodos;
		}),
	updatePriority: protectedProcedure
		.input(
			z.object({
				ids: z.array(z.string()),
				priority: z.enum(["high", "medium", "low", "urgent"]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { ids, priority } = input;

			const updatedTodos = await ctx.db
				.update(todos)
				.set({ priority })
				.where(inArray(todos.id, ids))
				.returning();

			return updatedTodos;
		}),
	delete: protectedProcedure
		.input(z.object({ ids: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const { ids } = input;

			const result = await ctx.db.delete(todos).where(inArray(todos.id, ids));

			if (result.rowCount >= 0) {
				return { success: true };
			} else {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "There was an error deleting the todos",
				});
			}
		}),
});
