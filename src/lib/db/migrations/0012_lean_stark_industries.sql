CREATE SEQUENCE "public"."todo_sequence" INCREMENT BY 1 MINVALUE 1 MAXVALUE 10000 START WITH 1 CACHE 10;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "code" SET DEFAULT 'TD' || LPAD(nextval('todo_sequence')::text, 5, '0');