ALTER TABLE "sub_tasks" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "status";