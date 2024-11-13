import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/lib/api/trpc";
import { user } from "../../db/schema";

export const authRouter = createTRPCRouter({
	checkEmail: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.query(async ({ ctx, input }) => {
			const existingUser = await ctx.db.query.user.findFirst({});

			if (existingUser) {
				return { success: false, status: 400, message: "User exists" };
			}

			return { success: true };
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(user).values({
				id: "1",
				name: input.name,
				email: "ciao@ciao.it",
				emailVerified: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.query.user.findFirst({
			//	orderBy: (users, { desc }: any) => [desc(users.createdAt)],
		});

		return post ?? null;
	}),
});
