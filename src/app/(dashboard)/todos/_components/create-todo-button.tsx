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
import { NewTodo } from "@/lib/db/schema.types";
import { newTodoSchema } from "@/lib/db/zod.schema";
import { priorityItems } from "./create-todo.form";
import { Icons } from "@/components/icons";
import { api } from "@/trpc/react";
import SelectWithIcons from "@/components/ui/select-with-icons";
import LoadingIcon from "@/components/loading-icon";

interface UpdateTaskSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {}

export function CreateTodoSheet({ ...props }: UpdateTaskSheetProps) {
	const createTodoMutation = api.todos.create.useMutation();

	const form = useForm<NewTodo>({
		resolver: zodResolver(newTodoSchema),
	});

	const [isUpdatePending, startUpdateTransition] = React.useTransition();

	async function onSubmit(input: NewTodo) {
		startUpdateTransition(async () => {
			const newTodo = await createTodoMutation.mutateAsync(input);
			form.reset();
			props.onOpenChange?.(false);
			if (newTodo) {
				toast({
					title: "Todo Created",
					description: "The todo has been created successfully.",
				});
			} else {
				toast({
					title: "Error",
					description: "An error occurred while creating the todo.",
				});
			}
		});
	}

	return (
		<Sheet {...props}>
			<SheetTrigger asChild>
				<Button>
					<Icons.add className="w-4 h-4" />
					Add Todo
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col sm:max-w-md ">
				<SheetHeader className="text-left">
					<SheetTitle>Create Todo 📝</SheetTitle>
					<SheetDescription>
						Create a new Todo and get to work!
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
						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Priority</FormLabel>
									<FormControl>
										<SelectWithIcons
											onValueChange={field.onChange}
											defaultValue={field.value}
											placeholder="Select a Priority"
											items={priorityItems}
										/>
									</FormControl>
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
								{isUpdatePending && <LoadingIcon />}
								Save
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
