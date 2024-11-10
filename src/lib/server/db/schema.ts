import {
	timestamp,
	pgTable,
	primaryKey,
	integer,
	text,
	boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	password: text("password"),
	role: text("role"),
	workType: text("work_type"),
});

export const accounts = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const sessions = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(verificationToken) => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	})
);

export const authenticators = pgTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	})
);

export const workspaces = pgTable("workspace", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	ownerId: text("owner_id").references(() => users.id, { onDelete: "cascade" }),
});

export const workspaceMembers = pgTable("workspace_member", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	joinedAt: timestamp("joined_at").defaultNow(),
});

export const projects = pgTable("project", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	description: text("description"),
	workspaceId: text("workspace_id").references(() => workspaces.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	status: text("status").notNull(),
});

export const projectMembers = pgTable("project_member", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	joinedAt: timestamp("joined_at").defaultNow(),
});

export const tasks = pgTable("task", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	description: text("description"),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	assigneeId: text("assignee_id").references(() => users.id),
	status: text("status").notNull(),
	priority: text("priority").notNull(),
	dueDate: timestamp("due_date"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const subTasks = pgTable("sub_task", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	title: text("title").notNull(),
	description: text("description"),
	parentTaskId: text("task_id").references(() => tasks.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const timeEntries = pgTable("time_entry", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	duration: integer("duration").notNull(), // in minutes
	date: timestamp("date").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("note", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	content: text("content").notNull(),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const attachments = pgTable("attachment", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text("name").notNull(),
	url: text("url").notNull(),
	taskId: text("task_id").references(() => tasks.id, { onDelete: "cascade" }),
	projectId: text("project_id").references(() => projects.id, {
		onDelete: "cascade",
	}),
	userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	accounts: many(accounts),
	sessions: many(sessions),
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
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id],
	}),
}));

export const workSpaceMembersRelations = relations(
	workspaceMembers,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceMembers.workspaceId],
			references: [workspaces.id],
		}),
		user: one(users, {
			fields: [workspaceMembers.userId],
			references: [users.id],
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
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id],
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
	assignee: one(users, {
		fields: [tasks.assigneeId],
		references: [users.id],
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
	user: one(users, {
		fields: [notes.userId],
		references: [users.id],
	}),
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
	task: one(tasks, {
		fields: [timeEntries.taskId],
		references: [tasks.id],
	}),
	user: one(users, {
		fields: [timeEntries.userId],
		references: [users.id],
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
	user: one(users, {
		fields: [attachments.userId],
		references: [users.id],
	}),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
	user: one(users, {
		fields: [authenticators.userId],
		references: [users.id],
	}),
}));
