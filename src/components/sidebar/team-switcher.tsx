"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

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

export function WorkSpaceSwitcher({
	workSpaces,
}: {
	workSpaces: {
		name: string;
		logo: React.ElementType;
		plan: string;
	}[];
}) {
	const { isMobile } = useSidebar();
	const [activeWorkSpace, setActiveWorkSpace] = React.useState(workSpaces[0]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="my-2">
					{isMobile ? <BuildStuffIcon /> : <BuildStuffLogo />}
				</div>
			</SidebarMenuItem>
			<Separator />
			<SidebarMenuItem className="border rounded-lg my-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
								{activeWorkSpace && (
									<activeWorkSpace.logo className="size-4 text-black" />
								)}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight ">
								<span className="truncate font-semibold">
									{activeWorkSpace && activeWorkSpace.name}
								</span>
								<span className="truncate text-xs">
									{activeWorkSpace && activeWorkSpace.plan}
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
						{workSpaces.map((workSpace, index) => (
							<DropdownMenuItem
								key={workSpace.name}
								onClick={() => setActiveWorkSpace(workSpace)}
								className="gap-2 p-2">
								<div className="flex size-6 items-center justify-center rounded-sm border">
									<workSpace.logo className="size-4 shrink-0" />
								</div>
								{workSpace.name}
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
