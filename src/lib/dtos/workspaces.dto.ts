import { z } from "zod";

export const createWorkspaceSchema = z.object({
	name: z.string().min(3, "The name of the workspace is wequired"),
	description: z.string().optional(),
	color: z.string().optional(),
});

export const updateWorkspaceSchema = z.object({
	id: z.string(),
	name: z.string().min(3, "The name of the workspace is wequired"),
	description: z.string().optional(),
	emoji: z.string().optional(),
});

export const addMemberSchema = z.object({
	workspaceId: z.string(),
	userId: z.string(),
	role: z.enum(["admin", "member"]),
});

export const removeMemberSchema = z.object({
	workspaceId: z.string(),
	userId: z.string(),
});

export const invitationLinkSchema = z.object({
	token: z.string(),
	role: z.string(),
	email: z.string().email(),
});
