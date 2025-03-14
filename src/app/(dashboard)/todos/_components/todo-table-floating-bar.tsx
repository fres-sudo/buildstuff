"use client";
import * as React from "react";
import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import {
	ArrowUp,
	CheckCircle2,
	Download,
	Loader,
	Trash2,
	X,
} from "lucide-react";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/kbd";

import { Todo } from "@/lib/db/schema.types";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { todos } from "@/lib/db/schema";
import LoadingIcon from "@/components/loading-icon";

interface TodosTableFloatingBarProps {
	table: Table<Todo>;
}

export function TodosTableFloatingBar({ table }: TodosTableFloatingBarProps) {
	const rows = table.getFilteredSelectedRowModel().rows;

	const [isPending, startTransition] = React.useTransition();
	const [action, setAction] = React.useState<
		"update-status" | "update-priority" | "export" | "delete"
	>();

	// Clear selection on Escape key press
	React.useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				table.toggleAllRowsSelected(false);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [table]);

	const updateStatusMutation = api.todos.updateStatus.useMutation();
	const updatePriorityMutation = api.todos.updatePriority.useMutation();
	const deleteTodosMutation = api.todos.updateStatus.useMutation();

	return (
		<Portal>
			<div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
				<div className="w-full overflow-x-auto">
					<div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
						<div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
							<span className="whitespace-nowrap text-xs">
								{rows.length} selected
							</span>
							<Separator
								orientation="vertical"
								className="ml-2 mr-1"
							/>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="size-5 hover:border"
										onClick={() => table.toggleAllRowsSelected(false)}>
										<X
											className="size-3.5 shrink-0"
											aria-hidden="true"
										/>
									</Button>
								</TooltipTrigger>
								<TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
									<p className="mr-2">Clear selection</p>
									<Kbd
										abbrTitle="Escape"
										variant="outline">
										Esc
									</Kbd>
								</TooltipContent>
							</Tooltip>
						</div>
						<Separator
							orientation="vertical"
							className="hidden h-5 sm:block"
						/>
						<div className="flex items-center gap-1.5">
							<Select
								onValueChange={(value: Todo["status"]) => {
									setAction("update-status");

									startTransition(async () => {
										const reposne = await updateStatusMutation.mutateAsync({
											ids: rows.map((row) => row.original.id),
											status: value,
										});
										toast({
											title: "Todos updated",
											description: "The selected todos have been updated.",
										});
									});
								}}>
								<Tooltip>
									<SelectTrigger asChild>
										<TooltipTrigger asChild>
											<Button
												variant="secondary"
												size="icon"
												className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
												disabled={isPending}>
												{isPending && action === "update-status" ? (
													<LoadingIcon />
												) : (
													<CheckCircle2
														className="size-3.5"
														aria-hidden="true"
													/>
												)}
											</Button>
										</TooltipTrigger>
									</SelectTrigger>
									<TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
										<p>Update status</p>
									</TooltipContent>
								</Tooltip>
								<SelectContent align="center">
									<SelectGroup>
										{todos.status.enumValues.map((status) => (
											<SelectItem
												key={status}
												value={status}
												className="capitalize">
												{status}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Select
								onValueChange={(value: Todo["priority"]) => {
									setAction("update-priority");

									startTransition(async () => {
										await updatePriorityMutation.mutateAsync({
											ids: rows.map((row) => row.original.id),
											priority: value,
										});
										toast({
											title: "Todos updated",
											description: "The selected todos have been updated.",
										});
									});
								}}>
								<Tooltip>
									<SelectTrigger asChild>
										<TooltipTrigger asChild>
											<Button
												variant="secondary"
												size="icon"
												className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
												disabled={isPending}>
												{isPending && action === "update-priority" ? (
													<LoadingIcon />
												) : (
													<ArrowUp
														className="size-3.5"
														aria-hidden="true"
													/>
												)}
											</Button>
										</TooltipTrigger>
									</SelectTrigger>
									<TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
										<p>Update priority</p>
									</TooltipContent>
								</Tooltip>
								<SelectContent align="center">
									<SelectGroup>
										{todos.priority.enumValues.map((priority) => (
											<SelectItem
												key={priority}
												value={priority}
												className="capitalize">
												{priority}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="icon"
										className="size-7 border"
										onClick={() => {
											setAction("export");

											startTransition(() => {
												exportTableToCSV(table, {
													excludeColumns: ["select", "actions"],
													onlySelected: true,
												});
											});
										}}
										disabled={isPending}>
										{isPending && action === "export" ? (
											<LoadingIcon />
										) : (
											<Download
												className="size-3.5"
												aria-hidden="true"
											/>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
									<p>Export todo</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="secondary"
										size="icon"
										className="size-7 border"
										onClick={() => {
											setAction("delete");

											startTransition(async () => {
												await deleteTodosMutation.mutateAsync({
													ids: rows.map((row) => row.original.id),
													status: "canceled",
												});

												toast({
													title: "Todos deleted",
													description: "The selected todos have been deleted.",
												});
												table.toggleAllRowsSelected(false);
											});
										}}
										disabled={isPending}>
										{isPending && action === "delete" ? (
											<LoadingIcon />
										) : (
											<Trash2
												className="size-3.5"
												aria-hidden="true"
											/>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
									<p>Delete todo</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
		</Portal>
	);
}
