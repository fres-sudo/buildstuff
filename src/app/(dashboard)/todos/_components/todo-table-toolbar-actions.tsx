"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";

import { DeleteTodosDialog } from "./delete-todo-dialog";
import { Todo } from "@/lib/db/schema.types";

interface TasksTableToolbarActionsProps {
	table: Table<Todo>;
}

export function TodosTableToolbarActions({
	table,
}: TasksTableToolbarActionsProps) {
	return (
		<div className="flex items-center gap-2">
			{table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DeleteTodosDialog
					todos={table
						.getFilteredSelectedRowModel()
						.rows.map((row) => row.original)}
					onSuccess={() => table.toggleAllRowsSelected(false)}
				/>
			) : null}
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					exportTableToCSV(table, {
						filename: "tasks",
						excludeColumns: ["select", "actions"],
					})
				}
				className="gap-2">
				<Download
					className="size-4"
					aria-hidden="true"
				/>
				Export
			</Button>
			{/**
			 * Other actions can be added here.
			 * For example, import, view, etc.
			 */}
		</div>
	);
}
