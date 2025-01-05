ALTER TABLE "session" DROP CONSTRAINT "session_workspaceId_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "workspaceId";