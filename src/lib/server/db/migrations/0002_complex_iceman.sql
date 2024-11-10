ALTER TABLE "attachment" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "task_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "note" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "note" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "note" ALTER COLUMN "task_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "note" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_member" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_member" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project_member" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "workspace_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_task" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sub_task" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sub_task" ALTER COLUMN "task_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "project_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "time_entry" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "time_entry" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "time_entry" ALTER COLUMN "task_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workspace_member" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workspace_member" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "workspace_member" ALTER COLUMN "workspace_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workspace" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workspace" ALTER COLUMN "id" DROP DEFAULT;