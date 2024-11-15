"use client";
import { useState } from "react";
import CreateTodoForm, { priorityItems } from "./create-todo.form";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { formatRelativeDate } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

const filterOptions = [
	{ label: "Due Date", value: "dueDate" },
	{ label: "Priority", value: "priority" },
	{ label: "Name", value: "name" },
	{ label: "Created At", value: "createdAt" },
];

const TodoList = () => {
	const [filter, setFilter] = useState<string | null>(null);
	const todosQuery = api.todos.list.useQuery();
	const updateTodoMutation = api.todos.update.useMutation();
	const deleteTodoMutation = api.todos.delete.useMutation();

	const handleToggleTodo = async (id: string) => {
		// await toggleTodoMutation.mutateAsync({ id });
		todosQuery.refetch();
	};

	const handleDeleteTodo = async (id: string) => {
		// await deleteTodoMutation.mutateAsync([id]);
		todosQuery.refetch();
	};

	const filteredTodos = todosQuery.data?.filter((todo) => {
		if (!filter) return true;
		switch (filter) {
			case "dueDate":
				return todo.dueDate;
			case "priority":
				return todo.priority;
			case "name":
				return todo.title;
			case "createdAt":
				return todo.createdAt;
			default:
				return true;
		}
	});

	return (
		<>
			<CreateTodoForm onSuccess={() => todosQuery.refetch()} />
			<div className="flex justify-between items-center mb-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button>Filter</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{filterOptions.map((option) => (
							<DropdownMenuItem
								key={option.value}
								onSelect={() => setFilter(option.value)}>
								{option.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button onClick={() => setFilter(null)}>Clear Filter</Button>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-10"></TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Due Date</TableHead>
						<TableHead>Priority</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{todosQuery.isLoading
						? Object.keys(Array.from({ length: 5 })).map((key) => (
								<TableRow key={key}>
									{Object.keys(Array.from({ length: 5 })).map((key) => (
										<TableCell
											className="space-y-4"
											key={key}>
											<Skeleton className="h-10 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						: filteredTodos?.map((todo) => (
								<TableRow
									key={todo.id}
									aria-disabled>
									<TableCell className="w-10">
										<Checkbox
											checked={todo.completedAt !== null}
											onChange={() => handleToggleTodo(todo.id)}
										/>
									</TableCell>
									<TableCell
										className={todo.completedAt !== null ? "text-muted" : ""}>
										{todo.title}
									</TableCell>
									<TableCell
										className={todo.completedAt !== null ? "text-muted" : ""}>
										{todo.code}
									</TableCell>
									<TableCell>
										{formatRelativeDate(new Date(todo.dueDate))}
									</TableCell>
									<TableCell>
										{priorityItems.map((item) => {
											if (item.value === todo.priority) {
												return (
													<div className="flex items-center">
														<item.icon className="mr-2 h-4 w-4" />
														{item.label}
													</div>
												);
											}
											<></>;
										})}
									</TableCell>
								</TableRow>
							))}
				</TableBody>
			</Table>
		</>
	);
};

export default TodoList;
