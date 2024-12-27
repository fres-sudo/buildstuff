import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import {
	tasks,
	projects,
	user,
	timeEntries,
	todos,
	taskStatuses,
} from "@/lib/db/schema";

export const analyticsRouter = createTRPCRouter({
	getProjectCompletion: publicProcedure.query(async () => {
		const result = await db
			.select({
				name: sql`CASE
                    WHEN ${taskStatuses.name} = 'completed' THEN 'Completed'
                    WHEN ${taskStatuses.name} = 'in-progress' THEN 'In Progress'
                    WHEN ${taskStatuses.name} = 'not-started' THEN 'Not Started'
                    WHEN ${tasks.dueDate} < NOW() THEN 'Overdue'
                    ELSE 'Unknown'
                END`.as("name"),
				value: sql`COUNT(*)`.as("value"),
			})
			.from(tasks)
			.innerJoin(taskStatuses, eq(tasks.statusId, taskStatuses.id))
			.groupBy(taskStatuses.name, tasks.dueDate);

		return result;
	}),

	getTaskDistribution: publicProcedure.query(async () => {
		const result = await db
			.select({
				project: projects.name,
				tasks: sql`COUNT(${tasks.id})`.as("tasks"),
			})
			.from(tasks)
			.innerJoin(projects, eq(tasks.projectId, projects.id))
			.groupBy(projects.name);

		return result;
	}),

	getMemberProductivity: publicProcedure.query(async () => {
		const result = await db
			.select({
				member: user.name,
				completed: sql`COUNT(${tasks.id})`.as("completed"),
			})
			.from(tasks)
			.innerJoin(user, eq(tasks.assigneeId, user.id))
			.where(eq(tasks.statusId, "completed"))
			.groupBy(user.name);

		return result;
	}),

	getTimeSpent: publicProcedure.query(async () => {
		const result = await db
			.select({
				date: sql`DATE(${timeEntries.date})`.as("date"),
				hours: sql`SUM(${timeEntries.duration}) / 60`.as("hours"),
			})
			.from(timeEntries)
			.groupBy(sql`DATE(${timeEntries.date})`)
			.orderBy(sql`DATE(${timeEntries.date})`);

		return result;
	}),

	getUpcomingDeadlines: publicProcedure.query(async () => {
		const result = await db
			.select({
				id: tasks.id,
				name: tasks.title,
				project: projects.name,
				dueDate: tasks.dueDate,
			})
			.from(tasks)
			.innerJoin(projects, eq(tasks.projectId, projects.id))
			.where(sql`${tasks.dueDate} > NOW()`)
			.orderBy(tasks.dueDate)
			.limit(5);

		return result;
	}),

	getTaskPriorityDistribution: publicProcedure.query(async () => {
		const result = await db
			.select({
				name: todos.priority,
				value: sql`COUNT(*)`.as("value"),
			})
			.from(todos)
			.groupBy(todos.priority);

		return result;
	}),
});
