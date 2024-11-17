"use client";

import {
	CirclePlus,
	Folder,
	Forward,
	MoreHorizontal,
	Plus,
	Trash2,
	type LucideIcon,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { Skeleton } from "../ui/skeleton";
import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import CreateProjectDialog from "@/app/(dashboard)/projects/_components/create-project-dialog";

export function NavProjects() {
	const { isMobile } = useSidebar();
	const { currentWorkspace } = useWorkspace();
	if (!currentWorkspace) return <LoadingSkeleton></LoadingSkeleton>;
	const projects = api.projects.list.useQuery({
		workspaceId: currentWorkspace?.id,
	});

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="flex justify-between">
				Projects
				<CreateProjectDialog onProjectCreated={(_) => projects.refetch()} />
			</SidebarGroupLabel>
			<SidebarMenu>
				{projects.isLoading && <LoadingSkeleton />}
				{projects.data?.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={`/projects/${item.id}`}>
								{/* <item.icon /> */}
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}>
								<DropdownMenuItem>
									<Folder className="text-muted-foreground" />
									<span>View Project</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Forward className="text-muted-foreground" />
									<span>Share Project</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Project</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				{/* <SidebarMenuItem>
					<SidebarMenuButton className="text-sidebar-foreground/70">
						<MoreHorizontal className="text-sidebar-foreground/70" />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem> */}
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
