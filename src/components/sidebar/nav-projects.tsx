"use client";

import { useMemo } from "react";
import { PinIcon, type LucideIcon } from "lucide-react";
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
				Projects
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
								{/* <item.icon /> */}
								<span>{item.name}</span>
								{item.pinned && <PinIcon className="w-2 h-2" />}
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}

const LoadingSkeleton = () => (
	<div className="flex mx-2 flex-col space-y-2">
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
		<Skeleton className="h-4 w-full" />
	</div>
);
