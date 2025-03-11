"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	CalendarIcon,
	CheckCircleIcon,
	CircleIcon,
	XCircleIcon,
} from "lucide-react";
import { TasksProps } from "../projects-tasks";
import { formatDate } from "@/lib/data-table/utils";

export const columns: ColumnDef<TasksProps>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
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
				title="Code"
			/>
		),
		cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
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
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">
						{row.getValue("title")}
					</span>
				</div>
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
			console.log(row);
			const status = row.getValue("status") as {
				id: string;
				name: string;
				createdAt: Date;
				updatedAt: Date | null;
				projectId: string | null;
				color: string | null;
				order: number | null;
				isFinal: boolean | null;
				isDefault: boolean | null;
			} | null;

			if (!status) {
				return <Badge color="gray">Unknown</Badge>;
			}

			return (
				<div className="flex w-[100px] items-center">
					<span>{status?.name}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
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
			const priority = priorities.find(
				(priority) => priority.value === row.getValue("priority")
			);

			if (!priority) {
				return null;
			}

			return (
				<div className="flex items-center">
					{priority.icon && (
						<priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{priority.label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "assignee",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Assignee"
			/>
		),
		cell: ({ row }) => {
			const assignee = row.getValue("assignee") as {
				id: string;
				name: string;
				email: string;
				emailVerified: boolean;
				image: string | null;
				createdAt: Date;
				updatedAt: Date;
			} | null;
			console.log(assignee);
			return (
				<div className="flex items-center">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={assignee?.image! || ""}
							alt={assignee?.name}
						/>
						<AvatarFallback>{assignee?.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="ml-2">
						<p className="text-sm font-medium">{assignee?.name}</p>
						<p className="text-xs text-muted-foreground">{assignee?.email}</p>
					</div>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "from",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Start Date"
			/>
		),
		cell: ({ row }) => {
			const date = row.getValue("from") as Date;
			return (
				<div className="flex items-center">
					<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					{formatDate(date)}
				</div>
			);
		},
	},
	{
		accessorKey: "to",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Due Date"
			/>
		),
		cell: ({ row }) => {
			const date = row.getValue("to") as Date;
			return (
				<div className="flex items-center">
					<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					<span>{formatDate(date)}</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
];

export const statuses = [
	{
		value: "backlog",
		label: "Backlog",
		icon: CircleIcon,
	},
	{
		value: "todo",
		label: "Todo",
		icon: CircleIcon,
	},
	{
		value: "in progress",
		label: "In Progress",
		icon: CircleIcon,
	},
	{
		value: "done",
		label: "Done",
		icon: CheckCircleIcon,
	},
	{
		value: "canceled",
		label: "Canceled",
		icon: XCircleIcon,
	},
];

export const priorities = [
	{
		value: "low",
		label: "Low",
		icon: CircleIcon,
	},
	{
		value: "medium",
		label: "Medium",
		icon: CircleIcon,
	},
	{
		value: "high",
		label: "High",
		icon: CircleIcon,
	},
];
