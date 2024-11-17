"use client";

import * as React from "react";
import { type DataTableRowAction } from "@/lib/data-table/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";
import { formatDate, getStatusIcon } from "@/lib/data-table/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Todo } from "@/lib/db/schema.types";
import { todos } from "@/lib/db/schema";
import { api } from "@/trpc/react";
import { priorityItems } from "./create-todo.form";
import { Skeleton } from "@/components/ui/skeleton";

interface GetColumnsProps {
	setRowAction: React.Dispatch<
		React.SetStateAction<DataTableRowAction<Todo> | null>
	>;
}

export function getColumns({
	setRowAction,
}: GetColumnsProps): ColumnDef<Todo>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "code",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Task"
				/>
			),
			cell: ({ row }) => <div className="w-20">{row.getValue("code")}</div>,
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "title",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Title"
				/>
			),
			cell: async ({ row }) => {
				return (
					<span className="max-w-[31.25rem] truncate font-medium">
						{row.getValue("title")}
					</span>
				);
			},
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Status"
				/>
			),
			cell: ({ row }) => {
				const status = todos.status.enumValues.find(
					(status) => status === row.original.status
				);

				if (!status) return null;

				const Icon = getStatusIcon(status);

				return (
					<div className="flex w-[6.25rem] items-center">
						<Icon
							className="mr-2 size-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<span className="capitalize">{status}</span>
					</div>
				);
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id));
			},
		},
		{
			accessorKey: "priority",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Priority"
				/>
			),
			cell: ({ row }) => {
				const priority = priorityItems.find(
					(priority) => priority.value === row.original.priority
				);

				if (!priority) return null;

				return (
					<div className="flex items-center">
						<priority.icon
							className="mr-2 size-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<span className="capitalize">{priority.label}</span>
					</div>
				);
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id));
			},
		},
		{
			accessorKey: "archived",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Archived"
				/>
			),
			cell: ({ row }) => (
				<Badge variant="outline">{row.original.archived ? "Yes" : "No"}</Badge>
			),
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Created At"
				/>
			),
			cell: ({ cell }) => formatDate(cell.getValue() as Date),
		},
		{
			id: "actions",
			cell: function Cell({ row }) {
				const [isUpdatePending, startUpdateTransition] = React.useTransition();

				return <></>;
			},
			size: 40,
		},
	];
}
