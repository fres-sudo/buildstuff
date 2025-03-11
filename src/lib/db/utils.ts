import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.default(sql`current_timestamp`)
		.$onUpdate(() => new Date()),
};

export const defaultTaskStatus = (projectId: string) => [
	{
		name: "To-do",
		color: "blue",
		orderd: 0,
		isFinal: false,
		isDefault: true,
		projectId,
	},
	{
		name: "In Progress",
		color: "yellow",
		orderd: 1,
		isFinal: false,
		isDefault: false,
		projectId,
	},
	{
		name: "Testing",
		color: "purple",
		orderd: 2,
		isFinal: false,
		isDefault: false,
		projectId,
	},
	{
		name: "Review",
		color: "orange",
		orderd: 3,
		isFinal: false,
		isDefault: false,
		projectId,
	},
	{
		name: "Done",
		color: "green",
		orderd: 4,
		isFinal: true,
		isDefault: false,
		projectId,
	},
];
