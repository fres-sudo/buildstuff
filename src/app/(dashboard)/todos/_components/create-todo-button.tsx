"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import {
	NewTodo,
	Todo,
	Label,
	NewLabel,
	NewTodoLabel,
} from "@/lib/db/schema.types";
import { newTodoSchema, newLabelSchema } from "@/lib/db/schema.zod";
import { priorityItems } from "./create-todo.form";
import { Icons } from "@/components/icons";

interface UpdateTaskSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {}

export function CreateTodoSheet({ ...props }: UpdateTaskSheetProps) {
	const [isUpdatePending, startUpdateTransition] = React.useTransition();
	const [newLabel, setNewLabel] = React.useState("");

	const form = useForm<NewTodo>({
		resolver: zodResolver(newTodoSchema),
	});

	async function onSubmit(input: NewTodo) {
		startUpdateTransition(async () => {
			form.reset();
			props.onOpenChange?.(false);
			toast({
				title: "Task updated",
				description: "The task details have been updated.",
			});
		});
	}

	async function handleCreateLabel() {
		if (newLabel.trim() === "") return;
		// const label = await onCreateLabel({ name: newLabel, color: "#0000FF" });
		// await onCreateTodoLabel({ todoId: todo!.id, labelId: label.id });
		setNewLabel("");
	}

	return (
		<Sheet {...props}>
			<SheetTrigger asChild>
				<Button>
					<Icons.add className="w-4 h-4" />
					Add Todo
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col gap-6 sm:max-w-md ">
				<SheetHeader className="text-left">
					<SheetTitle>Update task</SheetTitle>
					<SheetDescription>
						Update the task details and save the changes
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Do a kickflip"
											className="resize-none"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormItem>
							<FormLabel>Label</FormLabel>
							<Select
								onValueChange={
									(value) => {}
									// onCreateTodoLabel({ todoId: todo!.id, labelId: value })
								}
								defaultValue="">
								<FormControl>
									<SelectTrigger className="capitalize">
										<SelectValue placeholder="Select a label" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectGroup>
										{/* {labels.map((label) => (
											<SelectItem
												key={label.id}
												value={label.id}
												className="capitalize">
												{label.name}
											</SelectItem>
										))} */}
									</SelectGroup>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
						<FormItem>
							<FormLabel>Create new label</FormLabel>
							<FormControl>
								<Input
									placeholder="New label"
									value={newLabel}
									onChange={(e) => setNewLabel(e.target.value)}
								/>
							</FormControl>
							<Button
								onClick={handleCreateLabel}
								className="mt-2">
								Add Label
							</Button>
						</FormItem>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="capitalize">
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												{["todo", "in-progress", "done", "canceled"].map(
													(item) => (
														<SelectItem
															key={item}
															value={item}
															className="capitalize">
															{item}
														</SelectItem>
													)
												)}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Priority</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger className="capitalize">
												<SelectValue placeholder="Select a priority" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectGroup>
												{priorityItems.map((item) => (
													<SelectItem
														key={item.value}
														value={item.value}
														className="capitalize">
														<item.icon className="mr-2 h-4 w-4" />
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetFooter className="gap-2 pt-2 sm:space-x-0">
							<SheetClose asChild>
								<Button
									type="button"
									variant="outline">
									Cancel
								</Button>
							</SheetClose>
							<Button disabled={isUpdatePending}>
								{isUpdatePending && (
									<Loader
										className="mr-2 size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								Save
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
