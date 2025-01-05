import { createTRPCRouter, protectedProcedure } from "@/lib/api/trpc";
import { z } from "zod";
import {
  labels,
  projectInvitations,
  projectLabels,
  projectMembers,
  projectRoles,
  projects,
  tasks,
  user,
} from "@/lib/db/schema";
import { TRPCError } from "@trpc/server";
import { takeFirst, takeFirstOrThrow } from "@/lib/utils";
import { newProjectSchema, taskSchema } from "@/lib/db/zod.schema";
import { and, count, eq, exists, gte, ilike, lt, lte } from "drizzle-orm";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { isBefore } from "date-fns";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newProjectSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db
        .insert(projects)
        .values(input)
        .returning()
        .then(takeFirst);
      if (!project) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create project",
        });
      }
      const projectRole = await ctx.db
        .insert(projectRoles)
        .values({
          projectId: project.id,
          userId: ctx.session?.user.id,
          role: "owner",
        })
        .returning()
        .then(takeFirstOrThrow);
      await ctx.db
        .insert(projectMembers)
        .values({
          projectId: project.id,
          userId: ctx.session?.user.id,
          roleId: projectRole.id,
        })
        .returning()
        .then(takeFirstOrThrow);
      return project;
    }),
  update: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        data: newProjectSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(projects)
        .set({
          ...input.data,
        })
        .where(eq(projects.id, input.projectId))
        .returning()
        .then(takeFirst);
    }),
  listWithJoins: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.projects.findMany({
        where: and(
          eq(projects.workspaceId, input.workspaceId),
          exists(
            ctx.db
              .select()
              .from(projectMembers)
              .where(
                and(
                  eq(projectMembers.projectId, projects.id),
                  eq(projectMembers.userId, ctx.session?.user.id),
                ),
              ),
          ),
        ),
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          members: {
            with: {
              user: true,
            },
          },
          tasks: true,
        },
      });
    }),
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.projects.findMany({
        where: and(
          eq(projects.workspaceId, input.workspaceId),
          exists(
            ctx.db
              .select()
              .from(projectMembers)
              .where(
                and(
                  eq(projectMembers.projectId, projects.id),
                  eq(projectMembers.userId, ctx.session?.user.id),
                ),
              ),
          ),
        ),
      });
    }),
  search: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        query: z.string(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.projects.findMany({
        where: and(
          exists(
            ctx.db
              .select()
              .from(projectMembers)
              .where(
                and(
                  eq(projectMembers.projectId, projects.id),
                  eq(projectMembers.userId, ctx.session?.user.id),
                ),
              ),
          ),
          ilike(projects.name, `%${input}%`),
        ),
        limit: input.limit,
      });
    }),
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.projects.findFirst({
        where: eq(projects.id, input.projectId),
        with: {
          labels: {
            with: {
              label: true,
            },
          },
          members: {
            with: {
              user: true,
              project: true,
              role: true,
            },
          },
          tasks: {
            with: {
              assignee: true,
              status: true,
              subtasks: true,
            },
          },
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
    .input(z.object({ projectId: z.string(), labelIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return await Promise.all(
        input.labelIds.map(async (labelId) => {
          return ctx.db
            .insert(projectLabels)
            .values({
              projectId: input.projectId,
              labelId,
            })
            .returning()
            .then(takeFirst);
        }),
      );
    }),
  inviteMembers: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        memberIds: z.array(z.string()),
      }),
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
        }),
      );
    }),
  inviteGuests: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        emails: z.array(z.string()),
      }),
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
        }),
      );
      return invitations;
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
        .insert(projectRoles)
        .values({
          userId: invitatedUser.id,
          projectId: project.id,
          role: "guest",
        })
        .onConflictDoNothing()
        .returning()
        .then(takeFirst);

      if (!projectRole) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join project",
        });
      }
      await ctx.db.insert(projectMembers).values({
        userId: ctx.session?.user.id,
        projectId: project.id,
        roleId: projectRole.id,
      });
    }),
  getProjectTasksStats: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const projectId = input.projectId;

      const [
        totalTasks,
        assignedTasks,
        incompleteTasks,
        completedTasks,
        overdueTasks,
        tasksLastWeek,
        assignedTasksLastWeek,
        incompleteTasksLastWeek,
        completedTasksLastWeek,
        overdueTasksLastWeek,
      ] = await Promise.all([
        ctx.db
          .select({ count: count() })
          .from(tasks)
          .where(eq(tasks.projectId, projectId))
          .then(takeFirst),
        ctx.db
          .select({ count: count() })
          .from(tasks)
          .where(
            and(
              eq(tasks.projectId, projectId),
              eq(tasks.assigneeId, ctx.session?.user.id),
            ),
          )
          .then(takeFirst),
        ctx.db
          .select({ count: count() })
          .from(tasks)
          .where(
            and(
              eq(tasks.projectId, projectId),
              eq(tasks.assigneeId, ctx.session?.user.id),
              eq(tasks.statusId, "incomplete"),
            ),
          )
          .then(takeFirst),
        ctx.db
          .select({ count: count() })
          .from(tasks)
          .where(
            and(
              eq(tasks.projectId, projectId),
              eq(tasks.assigneeId, ctx.session?.user.id),
              eq(tasks.statusId, "completed"),
            ),
          )
          .then(takeFirst),
        ctx.db
          .select({ count: count() })
          .from(tasks)
          .where(
            and(
              eq(tasks.projectId, projectId),
              eq(tasks.assigneeId, ctx.session?.user.id),
              eq(tasks.statusId, "incomplete"),
              lte(tasks.to, new Date()),
            ),
          )
          .then(takeFirst),
        (async () => {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          const values = await ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(
              and(
                eq(tasks.projectId, projectId),
                eq(tasks.assigneeId, ctx.session?.user.id),
                gte(tasks.createdAt, lastWeek),
                lt(tasks.createdAt, new Date()),
              ),
            );
          return takeFirst(values);
        })(),
        (async () => {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(
              and(
                eq(tasks.projectId, projectId),
                eq(tasks.assigneeId, ctx.session?.user.id),
                gte(tasks.createdAt, lastWeek),
                lt(tasks.createdAt, new Date()),
                eq(tasks.statusId, "assigned"),
              ),
            )
            .then(takeFirst);
        })(),
        (async () => {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(
              and(
                eq(tasks.projectId, projectId),
                eq(tasks.assigneeId, ctx.session?.user.id),
                gte(tasks.createdAt, lastWeek),
                lt(tasks.createdAt, new Date()),
                eq(tasks.statusId, "incomplete"),
              ),
            )
            .then(takeFirst);
        })(),
        (async () => {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(
              and(
                eq(tasks.projectId, projectId),
                eq(tasks.assigneeId, ctx.session?.user.id),
                gte(tasks.createdAt, lastWeek),
                lt(tasks.createdAt, new Date()),
                eq(tasks.statusId, "completed"),
              ),
            )
            .then(takeFirst);
        })(),
        (async () => {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          return ctx.db
            .select({ count: count() })
            .from(tasks)
            .where(
              and(
                eq(tasks.projectId, projectId),
                eq(tasks.assigneeId, ctx.session?.user.id),
                gte(tasks.createdAt, lastWeek),
                lt(tasks.createdAt, new Date()),
                eq(tasks.statusId, "incomplete"),
                lte(tasks.to, new Date()),
              ),
            )
            .then(takeFirst);
        })(),
      ]);

      const taskDifference =
        (totalTasks?.count || 0) - (tasksLastWeek?.count || 0);
      const assignedTaskDifference =
        (assignedTasks?.count || 0) - (assignedTasksLastWeek?.count || 0);
      const incompleteTaskDifference =
        (incompleteTasks?.count || 0) - (incompleteTasksLastWeek?.count || 0);
      const completedTaskDifference =
        (completedTasks?.count || 0) - (completedTasksLastWeek?.count || 0);
      const overdueTaskDifference =
        (overdueTasks?.count || 0) - (overdueTasksLastWeek?.count || 0);

      return {
        totalTasks: totalTasks?.count || 0,
        assignedTasks: assignedTasks?.count || 0,
        incompleteTasks: incompleteTasks?.count || 0,
        completedTasks: completedTasks?.count || 0,
        overdueTasks: overdueTasks?.count || 0,
        taskDifference,
        assignedTaskDifference,
        incompleteTaskDifference,
        completedTaskDifference,
        overdueTaskDifference,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db
        .delete(projects)
        .where(eq(projects.id, input.projectId))
        .returning()
        .then(takeFirstOrThrow);
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return project;
    }),
});
