ALTER SEQUENCE "public"."project_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER SEQUENCE "public"."task_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER SEQUENCE "public"."todo_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 1;--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_workspaceId_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "workspaceId";