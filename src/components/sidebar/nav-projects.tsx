"use client";

import { useMemo } from "react";
import { Archive, PinIcon, type LucideIcon } from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { Skeleton } from "../ui/skeleton";
import { api } from "@/trpc/react";
import CreateProjectDialog from "@/app/(dashboard)/projects/_components/create-project-dialog";

export function NavProjects() {
	const { currentWorkspace } = useWorkspace();
	if (!currentWorkspace) return <LoadingSkeleton />;
	const projects = api.projects.list.useQuery({
		workspaceId: currentWorkspace?.id,
	});

	// useMemo(
	//   () =>
	//     api.projects.list.useQuery({
	//       workspaceId: currentWorkspace?.id,
	//     }),
	//   [currentWorkspace],
	// );

	const sortedProjects = useMemo(
		() =>
			projects.data?.sort((a, b) => {
				if (a.pinned && !b.pinned) return -1;
				if (!a.pinned && b.pinned) return 1;
				return 0;
			}),
		[projects]
	);
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="flex justify-between">
				<a
					className="hover:underline"
					href="/projects">
					Projects
				</a>
				<CreateProjectDialog onProjectCreated={(_) => projects.refetch()} />
			</SidebarGroupLabel>
			<SidebarMenu>
				{projects.isLoading && <LoadingSkeleton />}
				{sortedProjects?.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild>
							<a
								href={`/projects/${item.id}`}
								className="justify-between">
								<span>{(item.emoji || "🎯") + " " + item.name}</span>
								<div className="flex gap-1">
									{item.archived && <Archive className="w-4 h-4" />}
									{item.pinned && <PinIcon className="w-4 h-4" />}
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

const LoadingSkeleton = () => (
	<div className="flex mt-2 mx-2 flex-col space-y-2">
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
	</div>
);
