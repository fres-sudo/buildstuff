DROP TABLE "default_task_statuses" CASCADE;--> statement-breakpoint
ALTER TABLE "task_statuses" ADD COLUMN "is_final" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "task_statuses" ADD COLUMN "is_default" boolean DEFAULT false;