import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { timeEntries } from "@/lib/db/schema";
import { create } from "domain";
import { newTimeEntrySchema } from "@/lib/db/zod.schema";

export const timeEntriesRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newTimeEntrySchema.omit({ userId: true }))
		.mutation(async ({ ctx, input }) => {
			const { db } = ctx;
			const userId = ctx.session.user.id;

			const result = await db
				.insert(timeEntries)
				.values({
					...input,
					userId,
				})
				.returning();

			return result[0];
		}),

	list: protectedProcedure
		.input(
			z.object({
				page: z.number().int().positive(),
				limit: z.number().int().positive().max(100).default(10),
			})
		)
		.query(async ({ ctx, input }) => {
			const { db } = ctx;
			const userId = ctx.session.user.id;
			const { page, limit } = input;

			const offset = (page - 1) * limit;

			const result = await db
				.select()
				.from(timeEntries)
				.where(eq(timeEntries.userId, userId))
				.orderBy(desc(timeEntries.date))
				.limit(limit)
				.offset(offset);

			return result;
		}),

	getByDate: protectedProcedure
		.input(
			z.object({
				date: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { db } = ctx;
			const userId = ctx.session.user.id;
			const { date } = input;

			const result = await db
				.select()
				.from(timeEntries)
				.where(
					and(
						eq(timeEntries.userId, userId),
						eq(timeEntries.date, new Date(date))
					)
				);

			return result;
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db } = ctx;
			const userId = ctx.session.user.id;

			await db
				.delete(timeEntries)
				.where(
					and(eq(timeEntries.id, input.id), eq(timeEntries.userId, userId))
				);

			return { success: true };
		}),
});
