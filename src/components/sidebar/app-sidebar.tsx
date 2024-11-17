"use client";

import * as React from "react";
import {
	AudioWaveform,
	Bell,
	BookOpen,
	Bot,
	ChartLine,
	Check,
	CircleCheck,
	Command,
	Frame,
	GalleryVerticalEnd,
	Home,
	Hourglass,
	LayoutList,
	Map,
	MessageSquareCode,
	MessageSquareDashedIcon,
	MessageSquareDot,
	PersonStanding,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { WorkSpaceSwitcher } from "./team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { api } from "@/trpc/react";
import { Skeleton } from "../ui/skeleton";

const data = {
	navMain: [
		{
			title: "Home",
			url: "/home",
			icon: Home,
		},
		{
			title: "My tasks",
			url: "/my-tasks",
			icon: CircleCheck,
		},
		{
			title: "Messages",
			url: "/messages",
			icon: MessageSquareDot,
		},
		{
			title: "Analytics",
			url: "/analytics",
			icon: ChartLine,
		},
		{
			title: "Timesheet",
			url: "/timesheet",
			icon: Hourglass,
		},
	],
	personal: [
		{
			title: "Inbox",
			url: "/inbox",
			icon: Bell,
		},
		{
			title: "Todos",
			url: "/todos",
			icon: LayoutList,
		},
		{
			title: "Account",
			url: "/account",
			icon: PersonStanding,
		},
		{
			title: "Help",
			url: "/help",
			icon: Bot,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { currentWorkspace } = useWorkspace();
	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			{...props}>
			<SidebarHeader>
				<WorkSpaceSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					items={data.navMain}
					title={currentWorkspace?.name || "Loading..."}
				/>
				<NavMain
					items={data.personal}
					title="Personal"
				/>
				<NavProjects />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
