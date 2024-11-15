"use client";
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets";
import { z } from "zod";
import { createTodoSchema } from "@/lib/dtos/todos.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import {
	AlertCircle,
	ChevronDown,
	ChevronsUp,
	ChevronUp,
	SquareChevronUp,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SelectWithIcons from "@/components/ui/select-with-icons";
import { Icons } from "@/components/icons";
interface CreateTodoFormProps {
	onSuccess?: () => void;
}

export const priorityItems = [
	{
		value: "urgent",
		label: "Urgent",
		icon: SquareChevronUp,
	},
	{ value: "high", label: "High", icon: ChevronsUp },
	{ value: "medium", label: "Medium", icon: ChevronUp },
	{ value: "low", label: "Low", icon: ChevronDown },
];

const CreateTodoForm = ({ onSuccess }: CreateTodoFormProps) => {
	type CreateTodoSchema = z.infer<typeof createTodoSchema>;

	const form = useForm<CreateTodoSchema>({
		resolver: zodResolver(createTodoSchema),
	});
	const createTodoMutation = api.todos.create.useMutation();

	const handleCreateTodo = async (newTodo: CreateTodoSchema) => {
		if (!newTodo) return;
		await createTodoMutation.mutateAsync({
			name: newTodo.name,
			description: newTodo.description,
			dueDate: newTodo.dueDate,
			priority: newTodo.priority,
		});
		onSuccess?.call(null);
	};

	return (
		<div className="flex flex-col space-y-4">
			<Form {...form}>
				<form
					className="flex w-full space-x-4"
					onSubmit={form.handleSubmit(handleCreateTodo)}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="Todo Name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="Todo Description"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dueDate"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<DatePickerWithPresets
										placeholder="Due Date"
										date={field.value}
										onDateChange={field.onChange}
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
							<FormItem className="w-full">
								<FormControl>
									<SelectWithIcons
										onValueChange={field.onChange}
										defaultValue={field.value}
										placeholder="Priority"
										items={priorityItems}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={createTodoMutation.isPending}>
						{createTodoMutation.isPending ? (
							<Icons.spinner className="h-4 w-4 animate-spin" />
						) : (
							<Icons.add className="h-4 w-4" />
						)}
						Create Todo
					</Button>
				</form>
			</Form>
			{createTodoMutation.error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{createTodoMutation.error.message}
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
};

export default CreateTodoForm;
