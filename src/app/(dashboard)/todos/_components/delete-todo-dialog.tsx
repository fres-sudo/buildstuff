"use client";

import * as React from "react";
import { type Todo } from "@/lib/db/schema.types";
import { type Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";

interface DeleteTodosDialogProps
	extends React.ComponentPropsWithoutRef<typeof Dialog> {
	todos: Row<Todo>["original"][];
	showTrigger?: boolean;
	onSuccess?: () => void;
}

export function DeleteTodosDialog({
	todos,
	showTrigger = true,
	onSuccess,
	...props
}: DeleteTodosDialogProps) {
	const [isDeletePending, startDeleteTransition] = React.useTransition();
	const isDesktop = useMediaQuery("(min-width: 640px)");

	const deleteTodoMutation = api.todos.delete.useMutation();

	function onDelete() {
		startDeleteTransition(async () => {
			const response = await deleteTodoMutation.mutateAsync({
				ids: todos.map((todo) => todo.id),
			});

			props.onOpenChange?.(false);
			toast({
				title: "Todos deleted",
				description: "The selected todos have been deleted.",
			});
			onSuccess?.();
		});
	}

	if (isDesktop) {
		return (
			<Dialog {...props}>
				{showTrigger ? (
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="sm">
							<Trash
								className="mr-2 size-4"
								aria-hidden="true"
							/>
							Delete ({todos.length})
						</Button>
					</DialogTrigger>
				) : null}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your{" "}
							<span className="font-medium">{todos.length}</span>
							{todos.length === 1 ? " task" : " tasks"} from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:space-x-0">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button
							aria-label="Delete selected rows"
							variant="destructive"
							onClick={onDelete}
							disabled={isDeletePending}>
							{isDeletePending && (
								<Loader
									className="mr-2 size-4 animate-spin"
									aria-hidden="true"
								/>
							)}
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer {...props}>
			{showTrigger ? (
				<DrawerTrigger asChild>
					<Button
						variant="outline"
						size="sm">
						<Trash
							className="mr-2 size-4"
							aria-hidden="true"
						/>
						Delete ({todos.length})
					</Button>
				</DrawerTrigger>
			) : null}
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>
						This action cannot be undone. This will permanently delete your{" "}
						<span className="font-medium">{todos.length}</span>
						{todos.length === 1 ? " task" : " tasks"} from our servers.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={onDelete}
						disabled={isDeletePending}>
						{isDeletePending && (
							<Loader
								className="mr-2 size-4 animate-spin"
								aria-hidden="true"
							/>
						)}
						Delete
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
