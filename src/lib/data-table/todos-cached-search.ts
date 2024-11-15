import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "./parser";
import { Todo } from "../db/schema.types";
import { todos } from "../db/schema";

export const searchParamsCache = createSearchParamsCache({
	flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
		[]
	),
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<Todo>().withDefault([
		{ id: "createdAt", desc: true },
	]),
	title: parseAsString.withDefault(""),
	status: parseAsArrayOf(z.enum(todos.status.enumValues)).withDefault([]),
	priority: parseAsArrayOf(z.enum(todos.priority.enumValues)).withDefault([]),
	from: parseAsString.withDefault(""),
	to: parseAsString.withDefault(""),
});

export const getTodosSchema = z.object({
	flags: z.array(z.enum(["advancedTable", "floatingBar"])).default([]),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sort: z
		.array(
			z.object({
				id: z.string(),
				desc: z.boolean(),
			})
		)
		.default([{ id: "createdAt", desc: true }]),
	title: z.string().default(""),
	status: z.array(z.enum(todos.status.enumValues)).default([]),
	priority: z.array(z.enum(todos.priority.enumValues)).default([]),
	from: z.string().default(""),
	to: z.string().default(""),
});

export type GetTodosSchema = Awaited<
	ReturnType<typeof searchParamsCache.parse>
>;
