import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import {
	labels,
	projectInvitations,
	projectLabels,
	projectMembers,
	projectRoles,
	projects,
	user,
} from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst } from "@/lib/utils";
import {
	newLabelSchema,
	newProjectLabelSchema,
	newProjectSchema,
	newTodoSchema,
	projectInvitationSchema,
} from "@/lib/db/schema.zod";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";

export const projectsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newProjectSchema)
		.mutation(async ({ ctx, input }) => {
			return await ctx.db
				.insert(projects)
				.values(input)
				.returning()
				.then(takeFirst);
		}),
	list: protectedProcedure
		.input(
			z.object({
				workspaceId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select()
				.from(projects)
				.where(eq(projects.workspaceId, input.workspaceId));
		}),
	get: protectedProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ ctx, input }) => {
			return await ctx.db.query.projects.findFirst({
				where: eq(projects.id, input.projectId),
				with: {
					labels: true,
					members: {
						with: {
							user: true,
						},
					},
					tasks: true,
				},
			});
		}),
	getLabels: protectedProcedure
		.input(z.object({ projectId: z.string() }))
		.query(async ({ ctx, input }) => {
			const value = await ctx.db.query.projectLabels.findMany({
				where: eq(projectLabels.projectId, input.projectId),
				with: {
					label: true,
				},
			});
			return value.map((v) => v.label);
		}),
	addLabels: protectedProcedure
		.input(z.array(newProjectLabelSchema))
		.mutation(async ({ ctx, input }) => {
			return await ctx.db
				.insert(projectLabels)
				.values(input)
				.returning()
				.then(takeFirst);
		}),
	inviteMembers: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				memberIds: z.array(z.string()),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await Promise.all(
				input.memberIds.map(async (memberId) => {
					const projectRole = await ctx.db
						.insert(projectRoles)
						.values({
							projectId: input.projectId,
							userId: memberId,
							role: "member",
						})
						.returning()
						.then(takeFirst);
					if (!projectRole) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to add member",
						});
					}
					//TODO: send the message to the app inbox
					return ctx.db
						.insert(projectMembers)
						.values({
							projectId: input.projectId,
							userId: memberId,
							roleId: projectRole.id,
						})
						.returning()
						.then(takeFirst);
				})
			);
		}),
	inviteGuests: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				emails: z.array(z.string()),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const project = await ctx.db.query.projects.findFirst({
				where: eq(projects.id, input.projectId),
			});
			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}
			const invitations = await Promise.all(
				input.emails.map(async (email) => {
					const token = randomBytes(32).toString("hex");
					const hashedToken = await hash(token, 10);

					//TODO: send email to the user
					ctx.db
						.insert(projectInvitations)
						.values({
							email,
							projectId: project.id,
							token: hashedToken,
							expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
						})
						.returning()
						.then(takeFirst);
				})
			);
			return invitations;
		}),
	join: protectedProcedure
		.input(projectInvitationSchema)
		.mutation(async ({ ctx, input }) => {
			const project = await ctx.db.query.user.findFirst({
				where: eq(user.email, input.email),
			});
			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}

			const projectRole = await ctx.db
				.update(projectRoles)
				.set({
					userId: input.id,
					projectId: project.id,
					role: "member",
				})
				.returning()
				.then(takeFirst);

			if (!projectRole) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to join project",
				});
			}
			await ctx.db.update(projectMembers).set({
				userId: ctx.session?.user.id,
				projectId: project.id,
				roleId: projectRole.id,
			});
		}),
	joinViaEmail: protectedProcedure
		.input(z.object({ token: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const invitation = await ctx.db.query.projectInvitations.findFirst({
				where: eq(projectInvitations.token, input.token),
			});
			if (!invitation || !invitation.projectId) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Invitation not valid",
				});
			}
			const [project, invitatedUser] = await Promise.all([
				ctx.db.query.projects.findFirst({
					where: eq(projects.id, invitation.projectId),
				}),
				ctx.db.query.user.findFirst({
					where: eq(user.email, invitation.email),
				}),
			]);
			if (!project) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Project not found",
				});
			}
			if (!invitatedUser) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			const projectRole = await ctx.db
				.update(projectRoles)
				.set({
					userId: invitatedUser.id,
					projectId: project.id,
					role: "guest",
				})
				.returning()
				.then(takeFirst);

			if (!projectRole) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to join project",
				});
			}
			await ctx.db.update(projectMembers).set({
				userId: ctx.session?.user.id,
				projectId: project.id,
				roleId: projectRole.id,
			});
		}),
});
