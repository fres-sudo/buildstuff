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
import { labels, todos } from "@/lib/db/schema";
import { takeFirst } from "@/lib/utils";
import { newLabelSchema } from "@/lib/db/zod.schema";

import { Todo } from "@/lib/db/schema.types";

export const labelsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newLabelSchema)
		.mutation(async ({ ctx, input }) => {
			const newLabel = await ctx.db
				.insert(labels)
				.values(input)
				.returning()
				.then(takeFirst);
			return newLabel;
		}),
	list: protectedProcedure.query(async ({ ctx }) => {
		return await ctx.db.select().from(labels);
	}),
});
