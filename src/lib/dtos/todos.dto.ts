import { z } from "zod";

export const createTodoSchema = z.object({
	name: z.string().min(3, "Name is required"),
	description: z.string().optional(),
	dueDate: z.date(),
	priority: z.enum(["low", "medium", "high", "urgent"]),
});

export const updateTodoSchema = z.object({
	id: z.string(),
	name: z.string().min(3, "Name is required"),
	description: z.string().optional(),
	completedAt: z.date(),
	dueDate: z.date(),
	priority: z.enum(["low", "medium", "high", "urgent"]),
});
