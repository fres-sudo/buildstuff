CREATE TABLE IF NOT EXISTS "user_inbox" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"action" text,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
ALTER TABLE "project_invitations" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_labels" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_labels" ALTER COLUMN "label_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_roles" ALTER COLUMN "project_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_roles" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_inbox" ADD CONSTRAINT "user_inbox_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "project_invitations" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "project_labels" DROP COLUMN IF EXISTS "code";