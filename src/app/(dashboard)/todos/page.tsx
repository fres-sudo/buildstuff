import PageContainer from "@/components/layout/page-container";
import React from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { SearchParams } from "@/lib/data-table/types";
import { searchParamsCache } from "@/lib/data-table/todos-cached-search";
import { api } from "@/trpc/server";
import { TodosTable } from "./_components/todo-table";
import CreateTodoForm from "./_components/create-todo.form";
import { CreateTodoSheet } from "./_components/create-todo-button";

interface IndexPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
	const searchParams = await props.searchParams;
	const search = searchParamsCache.parse(searchParams);

	const promises = Promise.all([
		api.todos.list({
			...search,
		}),
		api.todos.getTodosStatusCounts(),
		api.todos.getTodosPriorityCounts(),
	]);

	return (
		<PageContainer>
			<div className="flex flex-col space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight">
						Your Todo List 📝
						<p className="text-sm text-muted-foreground font-thin">
							This is your personal private Todo List, only you can see this,
							and it won't be shared with anyone. Stay on track!
						</p>
					</h2>
					<CreateTodoSheet />
				</div>

				<React.Suspense
					fallback={
						<DataTableSkeleton
							columnCount={6}
							searchableColumnCount={1}
							filterableColumnCount={2}
							cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
							shrinkZero
						/>
					}>
					<TodosTable promises={promises} />
				</React.Suspense>
			</div>
		</PageContainer>
	);
}
