ALTER TABLE "project_invitations" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_inbox" ADD COLUMN "read" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_invitations" ADD CONSTRAINT "project_invitations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
