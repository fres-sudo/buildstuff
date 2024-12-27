"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/trpc/react";
import { useWorkspace } from "@/hooks/use-workspace";
import { Skeleton } from "./ui/skeleton";

export function SearchProjects({
	onProjectSelect,
}: {
	onProjectSelect: (projectId: string) => void;
}) {
	const { currentWorkspace } = useWorkspace();
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [query, setQuery] = React.useState("");
	const [debouncedQuery, setDebouncedQuery] = React.useState("");

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 800);

		return () => clearTimeout(timer);
	}, [query]);

	const { data: projects, isLoading } = api.projects.search.useQuery({
		workspaceId: currentWorkspace?.id || "",
		query: debouncedQuery,
	});

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between">
					{value
						? projects?.find((project) => project.id === value)?.name
						: "Select project..."}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Search project..."
						className="h-9"
						value={query}
						onValueChange={(value) => setQuery(value)}
					/>
					<CommandList>
						{isLoading ? (
							<CommandGroup>
								{Array.from({ length: 3 }).map((_, i) => (
									<CommandItem
										key={i}
										disabled>
										<Skeleton className="h-4 w-[160px]" />
									</CommandItem>
								))}
							</CommandGroup>
						) : (
							<>
								<CommandEmpty>No project found.</CommandEmpty>
								<CommandGroup>
									{projects?.map((project) => (
										<CommandItem
											key={project.id}
											value={project.id}
											onSelect={(currentValue) => {
												setValue(currentValue === value ? "" : currentValue);
												setOpen(false);
												onProjectSelect?.(currentValue);
											}}>
											{project.name}
											<Check
												className={cn(
													"ml-auto",
													value === project.id ? "opacity-100" : "opacity-0"
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}