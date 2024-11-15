ALTER TABLE "todos" RENAME COLUMN "name" TO "title";--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "code" varchar(7) DEFAULT '''TD'' || LPAD(nextval(''patient_code_seq'')::text, 5, ''0'')' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "status" varchar(30) DEFAULT 'todo' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN IF EXISTS "description";