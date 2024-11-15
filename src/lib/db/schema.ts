import {
	timestamp,
	pgTable,
	primaryKey,
	integer,
	text,
	boolean,
	varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { timestamps } from "./utils";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt").notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	expiresAt: timestamp("expiresAt"),
	password: text("password"),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
});

export const workspaces = pgTable("workspaces", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	description: text("description"),
	color: text("color").default("#0000FF"),
	ownerId: text("owner_id").references(() => user.id, { onDelete: "cascade" }),
	...timestamps,
});

export const workspaceMembers = pgTable("workspace_members", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	joinedAt: timestamp("joined_at").defaultNow(),
});

export const workspaceInvitations = pgTable("workspace_invitations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	email: text("email").notNull(),
	token: text("token").unique().notNull(),
	role: text("role").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});

export const projects = pgTable("projects", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	description: text("description"),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	...timestamps,
	status: text("status").notNull(),
});

export const projectMembers = pgTable("project_members", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	joinedAt: timestamp("joined_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	description: text("description"),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	assigneeId: text("assignee_id").references(() => user.id),
	status: text("status").notNull(),
	priority: text("priority").notNull(),
	dueDate: timestamp("due_date"),
	...timestamps,
});

export const subTasks = pgTable("sub_tasks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	description: text("description"),
	parentTaskId: text("task_id").references(() => tasks.id, {
		onDelete: "cascade",
	}),
	...timestamps,
});

export const timeEntries = pgTable("time_entries", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	duration: integer("duration").notNull(), // in minutes
	date: timestamp("date").notNull(),
	description: text("description"),
	...timestamps,
});

export const notes = pgTable("notes", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	content: text("content").notNull(),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	...timestamps,
});

export const attachments = pgTable("attachments", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	url: text("url").notNull(),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	...timestamps,
});

export const todos = pgTable("todos", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	code: text("code")
		.default(`'TD' || LPAD(nextval('patient_code_seq')::text, 5, '0')`)
		.notNull(),
	title: text("title"),
	status: text("status", {
		enum: ["todo", "in-progress", "done", "canceled"],
	})
		.notNull()
		.default("todo"),
	priority: text("priority", {
		enum: ["low", "medium", "high", "urgent"],
	}).notNull(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	archived: boolean("archived").notNull().default(false),
	completedAt: timestamp("completed_at"),
	dueDate: timestamp("due_date").notNull().defaultNow(),
	...timestamps,
});
export const labels = pgTable("labels", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	color: text("color").default("#0000FF"),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	...timestamps,
});

export const todoLabels = pgTable(
	"todo_labels",
	{
		todoId: text("todo_id")
			.notNull()
			.references(() => todos.id, { onDelete: "cascade" }),
		labelId: text("label_id")
			.notNull()
			.references(() => labels.id, {
				onDelete: "cascade",
			}),
		...timestamps,
	},
	(todoLabels) => ({
		pk: primaryKey({ columns: [todoLabels.todoId, todoLabels.labelId] }),
	})
);

// Relations
export const userRelations = relations(user, ({ many }) => ({
	account: many(account),
	sessions: many(session),
	workspaces: many(workspaceMembers),
	projects: many(projectMembers),
	tasks: many(tasks, { relationName: "assignee" }),
	timeEntries: many(timeEntries),
	notes: many(notes),
	attachments: many(attachments),
}));

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
	members: many(workspaceMembers),
	projects: many(projects),
	invitations: many(workspaceInvitations),
	owner: one(user, {
		fields: [workspaces.ownerId],
		references: [user.id],
	}),
}));

export const workSpaceMembersRelations = relations(
	workspaceMembers,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceMembers.workspaceId],
			references: [workspaces.id],
		}),
		user: one(user, {
			fields: [workspaceMembers.userId],
			references: [user.id],
		}),
	})
);

export const workspaceInvitationsRelations = relations(
	workspaceInvitations,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceInvitations.workspaceId],
			references: [workspaces.id],
		}),
	})
);

export const projectsRelations = relations(projects, ({ many, one }) => ({
	members: many(projectMembers),
	tasks: many(tasks),
	notes: many(notes),
	attachments: many(attachments),
	workspace: one(workspaces, {
		fields: [projects.workspaceId],
		references: [workspaces.id],
	}),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id],
	}),
	user: one(user, {
		fields: [projectMembers.userId],
		references: [user.id],
	}),
}));

export const tasksRelations = relations(tasks, ({ many, one }) => ({
	timeEntries: many(timeEntries),
	notes: many(notes),
	attachments: many(attachments),
	project: one(projects, {
		fields: [tasks.projectId],
		references: [projects.id],
	}),
	assignee: one(user, {
		fields: [tasks.assigneeId],
		references: [user.id],
		relationName: "assignee",
	}),
	subtasks: many(subTasks),
}));

export const subTasksRelations = relations(subTasks, ({ one }) => ({
	task: one(tasks, {
		fields: [subTasks.parentTaskId],
		references: [tasks.id],
	}),
}));

export const notesRelations = relations(notes, ({ one }) => ({
	task: one(tasks, {
		fields: [notes.taskId],
		references: [tasks.id],
	}),
	project: one(projects, {
		fields: [notes.projectId],
		references: [projects.id],
	}),
	user: one(user, {
		fields: [notes.userId],
		references: [user.id],
	}),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
	task: one(tasks, {
		fields: [timeEntries.taskId],
		references: [tasks.id],
	}),
	user: one(user, {
		fields: [timeEntries.userId],
		references: [user.id],
	}),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
	task: one(tasks, {
		fields: [attachments.taskId],
		references: [tasks.id],
	}),
	project: one(projects, {
		fields: [attachments.projectId],
		references: [projects.id],
	}),
	user: one(user, {
		fields: [attachments.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const sessionsRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const todoRelations = relations(todos, ({ one, many }) => ({
	user: one(user, {
		fields: [todos.userId],
		references: [user.id],
	}),
	labels: many(todoLabels),
}));

export const todoLabelRelations = relations(todoLabels, ({ one }) => ({
	todo: one(todos, {
		fields: [todoLabels.todoId],
		references: [todos.id],
	}),
	label: one(labels, {
		fields: [todoLabels.labelId],
		references: [labels.id],
	}),
}));

export const labelRelations = relations(labels, ({ many, one }) => ({
	user: one(user, {
		fields: [labels.userId],
		references: [user.id],
	}),
	todos: many(todoLabels),
}));
