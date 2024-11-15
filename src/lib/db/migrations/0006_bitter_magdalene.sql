ALTER TABLE "attachments" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "sub_tasks" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sub_tasks" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "time_entries" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "updated_at" SET DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "updated_at" timestamp DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "time_entries" ADD COLUMN "updated_at" timestamp DEFAULT current_timestamp;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD COLUMN "updated_at" timestamp DEFAULT current_timestamp;