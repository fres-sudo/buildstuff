ALTER TABLE "tasks" RENAME COLUMN "due_date" TO "to";--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "from" timestamp DEFAULT now();