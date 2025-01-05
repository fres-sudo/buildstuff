"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { BuildStuffIcon, BuildStuffLogo } from "../logo";
import { Separator } from "../ui/separator";
import WorkSpaceDialog from "./workspace-dialog";
import { useWorkspace } from "@/hooks/use-workspace";
import { api } from "@/trpc/react";

export function WorkSpaceSwitcher() {
	const { isMobile } = useSidebar();

	const workspaces = api.workspaces.list.useQuery();
	const { currentWorkspace, setCurrentWorkspace } = useWorkspace();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="my-2 data-[state=open]:my-0 flex items-center">
					<BuildStuffLogo className="data-[state=close]:hidden data-[state=open]:flex" />
				</div>
			</SidebarMenuItem>
			<Separator />
			<SidebarMenuItem className="border rounded-lg my-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="flex aspect-square size-8 text-xl items-center justify-center rounded-lg border p-2 text-black">
								{currentWorkspace?.emoji || "🏠"}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight ">
								<span className="truncate font-semibold">
									{currentWorkspace && currentWorkspace.name}
								</span>
								<span className="truncate text-xs">
									{currentWorkspace && currentWorkspace.description}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}>
						<DropdownMenuLabel className="text-xs text-muted-foreground">
							Work Spaces
						</DropdownMenuLabel>
						{workspaces.data
							?.sort(
								(a, b) =>
									new Date(b?.createdAt ?? new Date()).getTime() -
									new Date(a?.createdAt ?? new Date()).getTime()
							)
							.map((workSpace, index) => (
								<DropdownMenuItem
									key={workSpace?.id}
									onClick={() => {
										if (workSpace) setCurrentWorkspace(workSpace);
									}}
									className="gap-2 p-2">
									<div className="flex size-6 items-center justify-center rounded-sm border text-xs p-2">
										{workSpace?.emoji ?? "🏠"}
									</div>
									{workSpace?.name}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<WorkSpaceDialog />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
			<Separator />
		</SidebarMenu>
	);
}
