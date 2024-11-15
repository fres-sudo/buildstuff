"use client";

import * as React from "react";
import type {
	DataTableFilterField,
	DataTableRowAction,
} from "@/lib/data-table/types";

import { getStatusIcon, toSentenceCase } from "@/lib/data-table/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { DeleteTodosDialog } from "./delete-todo-dialog";
import { TodosTableToolbarActions } from "./todo-table-toolbar-actions";
import { UpdateTaskSheet } from "./update-task-sheet";
import { NewLabel, Label, NewTodoLabel, Todo } from "@/lib/db/schema.types";
import { TodosTableFloatingBar } from "./todo-table-floating-bar";
import { todos } from "@/lib/db/schema";
import { priorityItems } from "./create-todo.form";
import { getColumns } from "./todo-table-colunmn";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/lib/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;

interface TodosTableProps {
	promises: Promise<
		[
			RouterOutputs["todos"]["list"],
			RouterOutputs["todos"]["getTodosStatusCounts"],
			RouterOutputs["todos"]["getTodosPriorityCounts"],
		]
	>;
}

export function TodosTable({ promises }: TodosTableProps) {
	const [{ data, pageCount }, statusCounts, priorityCounts] =
		React.use(promises);

	const [rowAction, setRowAction] =
		React.useState<DataTableRowAction<Todo> | null>(null);

	const columns = React.useMemo(
		() => getColumns({ setRowAction }),
		[setRowAction]
	);

	const filterFields: DataTableFilterField<Todo>[] = [
		{
			id: "title",
			label: "Title",
			placeholder: "Filter titles...",
		},
		{
			id: "status",
			label: "Status",
			options: todos.status.enumValues.map((status) => ({
				label: toSentenceCase(status),
				value: status,
				icon: getStatusIcon(status),
				count: statusCounts[status],
			})),
		},
		{
			id: "priority",
			label: "Priority",
			options: priorityItems.map((priority) => ({
				label: priority.label,
				value: priority.value,
				icon: priority.icon,
				count: priorityCounts[priority.value as keyof typeof priorityCounts],
			})),
		},
	];

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		filterFields,
		initialState: {
			sorting: [{ id: "createdAt", desc: true }],
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow: Todo, index) => `${originalRow.id}-${index}`,
		shallow: false,
		clearOnDefault: true,
	});

	return (
		<>
			<DataTable
				table={table}
				floatingBar={<TodosTableFloatingBar table={table} />}>
				<DataTableToolbar
					table={table}
					filterFields={filterFields}>
					<TodosTableToolbarActions table={table} />
				</DataTableToolbar>
			</DataTable>
			<UpdateTaskSheet
				open={rowAction?.type === "update"}
				onOpenChange={() => setRowAction(null)}
				todo={rowAction?.row.original ?? null}
				labels={[]}
				onCreateLabel={function (label: NewLabel): Promise<Label> {
					throw new Error("Function not implemented.");
				}}
				onCreateTodoLabel={function (todoLabel: NewTodoLabel): Promise<void> {
					throw new Error("Function not implemented.");
				}}
			/>
			<DeleteTodosDialog
				open={rowAction?.type === "delete"}
				onOpenChange={() => setRowAction(null)}
				todos={rowAction?.row.original ? [rowAction?.row.original] : []}
				showTrigger={false}
				onSuccess={() => rowAction?.row.toggleSelected(false)}
			/>
		</>
	);
}