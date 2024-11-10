import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/lib/server/api/trpc";
import { users } from "../../db/schema";

export const authRouter = createTRPCRouter({
	checkEmail: publicProcedure
		.input(z.object({ email: z.string().email() }))
		.query(async ({ ctx, input }) => {
			const existingUser = await ctx.db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, input.email),
			});

			if (existingUser) {
				return { success: false, status: 400, message: "User exists" };
			}

			return { success: true };
		}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(users).values({
				name: input.name,
				email: "ciao@ciao.it",
			});
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.query.users.findFirst({
			//	orderBy: (users, { desc }: any) => [desc(users.createdAt)],
		});

		return post ?? null;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
