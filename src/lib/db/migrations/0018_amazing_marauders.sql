ALTER TABLE "projects" ADD COLUMN "emoji" text;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "emoji" text;--> statement-breakpoint
ALTER TABLE "workspaces" DROP COLUMN IF EXISTS "color";--> statement-breakpoint
ALTER TABLE "workspaces" DROP COLUMN IF EXISTS "logo";