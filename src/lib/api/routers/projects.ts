import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import {
	labels,
	projectInvitations,
	projectLabels,
	projectMembers,
	projectRoles,
	projects,
	todos,
	user,
} from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst } from "@/lib/utils";
import {
	newLabelSchema,
	newProjectLabelSchema,
	newTodoSchema,
} from "@/lib/db/schema.zod";
import { Todo } from "@/lib/db/schema.types";
import { eq } from "drizzle-orm";

export const projectsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(newLabelSchema)
		.mutation(async ({ ctx, input }) => {
			const newLabel = await ctx.db
				.insert(labels)
				.values(input)
				.returning()
				.then(takeFirst);
			return newLabel;
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
	join: protectedProcedure
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
});
