ALTER TABLE "todos" ALTER COLUMN "code" SET DEFAULT 'TD-' || LPAD(nextval('todo_sequence')::text, 5, '0');