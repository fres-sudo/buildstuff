import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
	user,
	session,
	account,
	verification,
	workspaces,
	workspaceMembers,
	workspaceInvitations,
	projects,
	projectMembers,
	tasks,
	subTasks,
	timeEntries,
	notes,
	attachments,
	todos,
	labels,
	projectLabels,
} from "./schema";
// User schemas
export const userSchema = createSelectSchema(user);
export const newUserSchema = createInsertSchema(user);

// Session schemas
export const sessionSchema = createSelectSchema(session);
export const newSessionSchema = createInsertSchema(session);

// Account schemas
export const accountSchema = createSelectSchema(account);
export const newAccountSchema = createInsertSchema(account);

// Verification schemas
export const verificationSchema = createSelectSchema(verification);
export const newVerificationSchema = createInsertSchema(verification);

// Workspace schemas
export const workspaceSchema = createSelectSchema(workspaces);
export const newWorkspaceSchema = createInsertSchema(workspaces);

// WorkspaceMember schemas
export const workspaceMemberSchema = createSelectSchema(workspaceMembers);
export const newWorkspaceMemberSchema = createInsertSchema(workspaceMembers);

// WorkspaceInvitation schemas
export const workspaceInvitationSchema =
	createSelectSchema(workspaceInvitations);
export const newWorkspaceInvitationSchema =
	createInsertSchema(workspaceInvitations);

// Project schemas
export const projectSchema = createSelectSchema(projects);
export const newProjectSchema = createInsertSchema(projects);

// ProjectMember schemas
export const projectMemberSchema = createSelectSchema(projectMembers);
export const newProjectMemberSchema = createInsertSchema(projectMembers);

// ProjectLabels schemas
export const projectLabelSchema = createSelectSchema(projectLabels);
export const newProjectLabelSchema = createInsertSchema(projectLabels);

// Task schemas
export const taskSchema = createSelectSchema(tasks);
export const newTaskSchema = createInsertSchema(tasks);

// SubTask schemas
export const subTaskSchema = createSelectSchema(subTasks);
export const newSubTaskSchema = createInsertSchema(subTasks);

// TimeEntry schemas
export const timeEntrySchema = createSelectSchema(timeEntries);
export const newTimeEntrySchema = createInsertSchema(timeEntries);

// Note schemas
export const noteSchema = createSelectSchema(notes);
export const newNoteSchema = createInsertSchema(notes);

// Attachment schemas
export const attachmentSchema = createSelectSchema(attachments);
export const newAttachmentSchema = createInsertSchema(attachments);

// Todo schemas
export const todoSchema = createSelectSchema(todos);
export const newTodoSchema = createInsertSchema(todos);

// Label schemas
export const labelSchema = createSelectSchema(labels);
export const newLabelSchema = createInsertSchema(labels);
