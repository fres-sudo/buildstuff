import {
	timestamp,
	pgTable,
	primaryKey,
	integer,
	text,
	boolean,
	varchar,
	pgSequence,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
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
	color: text("color").default("zinc"),
	logo: text("logo"),
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
	role: text("role", { enum: ["admin", "member"] })
		.notNull()
		.default("member"),
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
	role: text("role", { enum: ["admin", "member"] })
		.notNull()
		.default("member"),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});

export const projects = pgTable("projects", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	code: text("code")
		.default(sql`'P-' || LPAD(nextval('project_sequence')::text, 5, '0')`)
		.notNull(),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	...timestamps,
});

export const projectLabels = pgTable("project_labels", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	labelId: text("label_id").references(() => labels.id, {
		onDelete: "cascade",
	}),
	...timestamps,
	code: text("code")
		.default(sql`'TD-' || LPAD(nextval('todo_sequence')::text, 5, '0')`)
		.notNull(),
});

export const projectMembers = pgTable("project_members", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	roleId: text("role_id").references(() => projectRoles.id),
	joinedAt: timestamp("joined_at").defaultNow(),
});

export const projectRoles = pgTable("project_roles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
});

export const projectInvitations = pgTable("project_invitations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	email: text("email").notNull(),
	token: text("token").unique().notNull(),
	role: text("role", { enum: ["admin", "member", "guest"] })
		.notNull()
		.default("guest"),
	expiresAt: timestamp("expires_at").notNull(),
	...timestamps,
});

export const tasks = pgTable("tasks", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	code: text("code")
		.default(sql`'T-' || LPAD(nextval('task_sequence')::text, 5, '0')`)
		.notNull(),
	description: text("description"),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	statusId: text("status_id").references(() => taskStatuses.id, {
		onDelete: "set null", //  Set null if status is deleted
	}),
	position: integer("position").default(0),
	assigneeId: text("assignee_id").references(() => user.id, {
		onDelete: "set null", //  Set null if user is deleted
	}),
	reviewerId: text("reviewer_id").references(() => user.id, {
		onDelete: "set null", //  Set null if user is deleted
	}),
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
	status: text("status", {
		enum: ["todo", "in-progress", "done", "canceled"],
	}),
	...timestamps,
});

export const taskStatuses = pgTable("task_statuses", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	name: text("name").notNull(),
	order: integer("order").default(0),
	color: text("color"),
	...timestamps,
});

export const taskLabels = pgTable("task_labels", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	labelId: text("label_id").references(() => labels.id, {
		onDelete: "cascade",
	}),
	...timestamps,
});

export const defaultTaskStatuses = pgTable("default_task_statuses", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	color: text("color"),
	order: integer("order").default(0),
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
		.default(sql`'TD-' || LPAD(nextval('todo_sequence')::text, 5, '0')`)
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
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	...timestamps,
});

/** /////////////////////////////////////
 * Relations
 */ //////////////////////////////////////

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
	labels: many(labels),
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
	labels: many(projectLabels),
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
	status: one(taskStatuses, {
		fields: [tasks.statusId],
		references: [taskStatuses.id],
	}),
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
}));

export const labelRelations = relations(labels, ({ many, one }) => ({
	workspace: one(workspaces, {
		fields: [labels.workspaceId],
		references: [workspaces.id],
	}),
}));

export const projectLabelsRelations = relations(projectLabels, ({ one }) => ({
	project: one(projects, {
		fields: [projectLabels.projectId],
		references: [projects.id],
	}),
	label: one(labels, {
		fields: [projectLabels.labelId],
		references: [labels.id],
	}),
}));

export const projectInvitationsRelations = relations(
	projectInvitations,
	({ one }) => ({
		project: one(projects, {
			fields: [projectInvitations.projectId],
			references: [projects.id],
		}),
	})
);

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
	task: one(tasks, {
		fields: [taskLabels.taskId],
		references: [tasks.id],
	}),
	label: one(labels, {
		fields: [taskLabels.labelId],
		references: [labels.id],
	}),
}));

export const projectsRolesRelations = relations(projectRoles, ({ one }) => ({
	project: one(projects, {
		fields: [projectRoles.projectId],
		references: [projects.id],
	}),
	user: one(user, {
		fields: [projectRoles.userId],
		references: [user.id],
	}),
}));

export const taskStatusesRelations = relations(taskStatuses, ({ one }) => ({
	project: one(projects, {
		fields: [taskStatuses.projectId],
		references: [projects.id],
	}),
}));

/** /////////////////////////////////////
 * Sequences
 */ //////////////////////////////////////

export const todoSequece = pgSequence("todo_sequence", {
	startWith: 1,
	maxValue: 10000,
	cache: 10,
});

export const projectSequence = pgSequence("project_sequence", {
	startWith: 1,
	maxValue: 10000,
	cache: 10,
});

export const taskSequence = pgSequence("task_sequence", {
	startWith: 1,
	maxValue: 10000,
	cache: 10,
});
