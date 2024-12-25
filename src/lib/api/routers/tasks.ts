import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	ilike,
	inArray,
	lte,
} from "drizzle-orm";
import { tasks, todos } from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst } from "@/lib/utils";
import { newTaskSchema, newTodoSchema } from "@/lib/db/schema.zod";
import { getTodosSchema } from "@/lib/data-table/todos-cached-search";
import { Todo } from "@/lib/db/schema.types";

export const tasksRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newTaskSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db
				.insert(tasks)
				.values(input)
				.returning()
				.then(takeFirst);
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
