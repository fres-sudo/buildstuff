import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import {
	workspaces,
	workspaceMembers,
	user,
	workspaceInvitations,
} from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst, takeFirstOrThrow } from "@/lib/utils";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
	addMemberSchema,
	createWorkspaceSchema,
	invitationLinkSchema,
	removeMemberSchema,
	updateWorkspaceSchema,
} from "@/lib/dtos/workspaces.dto";
import { newWorkspaceSchema } from "@/lib/db/schema.zod";

export const workspacesRouter = createTRPCRouter({
	// **Create Workspace**
	create: protectedProcedure
		.input(newWorkspaceSchema)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;

			const newWorkspace = await ctx.db
				.insert(workspaces)
				.values({
					...input,
					ownerId: userId,
				})
				.returning()
				.then(takeFirstOrThrow);

			await ctx.db.insert(workspaceMembers).values({
				workspaceId: newWorkspace.id,
				userId,
				role: "admin",
			});

			return newWorkspace;
		}),
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const { id } = input;
			const userId = ctx.session.user.id;

			// Controlla se l'utente è un membro della workspace
			const membership = await ctx.db.query.workspaceMembers.findFirst({
				where:
					eq(workspaceMembers.workspaceId, id) &&
					eq(workspaceMembers.userId, userId),
			});

			if (!membership) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Non hai accesso a questa workspace.",
				});
			}

			// Recupera la workspace con i dettagli
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, id),
			});

			if (!workspace) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workspace non trovata.",
				});
			}

			return workspace;
		}),

	list: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		// Recupera tutte le workspace di cui l'utente è membro
		const memberWorkspaces = await ctx.db.query.workspaceMembers.findMany({
			where: eq(workspaceMembers.userId, userId),
			with: { workspace: true },
		});

		return memberWorkspaces.map((member) => member.workspace);
	}),

	// **Update Workspace**
	update: protectedProcedure
		.input(updateWorkspaceSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, name, description, color } = input;
			const userId = ctx.session.user.id;

			// Controlla se l'utente è l'owner della workspace
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, id),
			});

			if (!workspace) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workspace not found.",
				});
			}

			if (workspace.ownerId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "You are not the owner of this workspace.",
				});
			}

			const updatedWorkspace = await ctx.db
				.update(workspaces)
				.set({
					name,
					description,
					color,
					updatedAt: new Date(),
				})
				.where(eq(workspaces.id, id))
				.returning();

			return updatedWorkspace;
		}),
	// **Delete Workspace**
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { id } = input;
			const userId = ctx.session.user.id;

			// Controlla se l'utente è l'owner della workspace
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, id),
			});

			if (!workspace) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workspace non trovata.",
				});
			}

			if (workspace.ownerId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Non sei l'owner di questa workspace.",
				});
			}

			// Elimina la workspace (cascading delete grazie alle foreign keys)
			await ctx.db.delete(workspaces).where(eq(workspaces.id, id));

			return { success: true };
		}),

	// **Add Member to Workspace**
	addMember: protectedProcedure
		.input(addMemberSchema)
		.mutation(async ({ ctx, input }) => {
			const { workspaceId, userId, role } = input;
			const currentUserId = ctx.session.user.id;

			// Verifica se l'utente corrente è l'owner della workspace
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, workspaceId),
			});

			if (!workspace) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workspace not found.",
				});
			}

			if (workspace.ownerId !== currentUserId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only the owner can add members.",
				});
			}

			// Verifica se l'utente da aggiungere esiste
			const userToAdd = await ctx.db.query.user.findFirst({
				where: eq(user.id, userId),
			});

			if (!userToAdd) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found.",
				});
			}

			// Controlla se l'utente è già un membro
			const existingMember = await ctx.db.query.workspaceMembers.findFirst({
				where:
					eq(workspaceMembers.workspaceId, workspaceId) &&
					eq(workspaceMembers.userId, userId),
			});

			if (existingMember) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "L'utente è già un membro della workspace.",
				});
			}

			// Aggiungi il membro
			await ctx.db.insert(workspaceMembers).values({
				workspaceId,
				userId,
				role,
			});

			return { success: true };
		}),

	// **Remove Member from Workspace**
	removeMember: protectedProcedure
		.input(removeMemberSchema)
		.mutation(async ({ ctx, input }) => {
			const { workspaceId, userId } = input;
			const currentUserId = ctx.session.user.id;

			// Verifica se l'utente corrente è l'owner della workspace
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, workspaceId),
			});

			if (!workspace) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Workspace non trovata.",
				});
			}

			if (workspace.ownerId !== currentUserId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Solo l'owner può rimuovere membri.",
				});
			}

			// Non permettere di rimuovere l'owner
			if (userId === workspace.ownerId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Non puoi rimuovere l'owner della workspace.",
				});
			}

			// Verifica se l'utente è un membro
			const member = await ctx.db.query.workspaceMembers.findFirst({
				where:
					eq(workspaceMembers.workspaceId, workspaceId) &&
					eq(workspaceMembers.userId, userId),
			});

			if (!member) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "L'utente non è un membro della workspace.",
				});
			}

			// Rimuovi il membro
			await ctx.db
				.delete(workspaceMembers)
				.where(
					eq(workspaceMembers.workspaceId, workspaceId) &&
						eq(workspaceMembers.userId, userId)
				);

			return { success: true };
		}),
	listMembers: protectedProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ ctx, input }) => {
			const { workspaceId } = input;
			const userId = ctx.session.user.id;

			// Verifica se l'utente è un membro della workspace
			const membership = await ctx.db.query.workspaceMembers.findFirst({
				where:
					eq(workspaceMembers.workspaceId, workspaceId) &&
					eq(workspaceMembers.userId, userId),
			});

			if (!membership) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Non hai accesso a questa workspace.",
				});
			}

			// Recupera tutti i membri della workspace
			const members = await ctx.db.query.workspaceMembers.findMany({
				where: eq(workspaceMembers.workspaceId, workspaceId),
				with: { user: true },
			});

			return members.map((member) => ({
				userId: member.user?.id ?? "unknown",
				name: member.user?.name ?? "Unknown User",
				email: member.user?.email ?? "no-email",
				role: member.role,
			}));
		}),
	joinViaInvitation: protectedProcedure
		.input(invitationLinkSchema)
		.mutation(async ({ ctx, input }) => {
			const { token } = input;
			const userId = ctx.session.user.id;

			// Find the invitation
			const invitation = await ctx.db.query.workspaceInvitations.findFirst({
				where: eq(workspaceInvitations.token, token),
			});

			if (
				!invitation ||
				!invitation.workspaceId ||
				invitation.expiresAt < new Date()
			) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invalid or expired invitation link",
				});
			}

			// Check if user is already a member
			const existingMember = await ctx.db.query.workspaceMembers.findFirst({
				where:
					eq(workspaceMembers.workspaceId, invitation.workspaceId) &&
					eq(workspaceMembers.userId, userId),
			});

			if (existingMember) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "You are already a member of this workspace",
				});
			}

			// Add member to workspace
			await ctx.db.insert(workspaceMembers).values({
				workspaceId: invitation.workspaceId,
				userId,
				role: invitation.role,
				joinedAt: new Date(),
			});

			// Delete used invitation
			ctx.db
				.delete(workspaceInvitations)
				.where(eq(workspaceInvitations.token, token));

			return { success: true };
		}),
	invite: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string(),
				email: z.string().email(),
				role: z.enum(["admin", "member"]),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { workspaceId, email, role } = input;
			const userId = ctx.session.user.id;

			// Check if user is workspace owner
			const workspace = await ctx.db.query.workspaces.findFirst({
				where: eq(workspaces.id, workspaceId),
			});

			if (!workspace || workspace.ownerId !== userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Only workspace owner can send invitations",
				});
			}
			// Generate unique token
			const token = crypto.randomBytes(32).toString("hex");
			const hashedToken = await bcrypt.hash(token, 10);

			// Create invitation with 7 days expiry
			await ctx.db.insert(workspaceInvitations).values({
				workspaceId: workspace.id,
				token: hashedToken,
				email,
				role,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			});

			return { token };
		}),
});
