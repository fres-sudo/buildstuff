CREATE SEQUENCE "public"."project_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 10;--> statement-breakpoint
CREATE SEQUENCE "public"."task_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 10;--> statement-breakpoint
ALTER TABLE "project_labels" ADD COLUMN "code" text DEFAULT 'TD-' || LPAD(nextval('todo_sequence')::text, 5, '0') NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "code" text DEFAULT 'P-' || LPAD(nextval('project_sequence')::text, 5, '0') NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "code" text DEFAULT 'T-' || LPAD(nextval('task_sequence')::text, 5, '0') NOT NULL;