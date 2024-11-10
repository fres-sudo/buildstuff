"use client";

import * as React from "react";
import {
	AudioWaveform,
	Bell,
	BookOpen,
	Bot,
	ChartLine,
	Command,
	Frame,
	GalleryVerticalEnd,
	Home,
	Hourglass,
	Map,
	MessageSquareCode,
	MessageSquareDashedIcon,
	MessageSquareDot,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { is } from "drizzle-orm";

const data = {
	user: {
		name: "fres",
		email: "fres@fres.space",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Acme Inc",
			logo: GalleryVerticalEnd,
			plan: "Enterprise",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Home",
			url: "/home",
			icon: Home,
		},
		{
			title: "Inbox",
			url: "/inbox",
			icon: Bell,
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
		{
			title: "Settings",
			url: "#",
			icon: Settings2,
			isCollapsible: true,
			items: [
				{
					title: "General",
					url: "#",
				},
				{
					title: "Team",
					url: "#",
				},
				{
					title: "Billing",
					url: "#",
				},
				{
					title: "Limits",
					url: "#",
				},
			],
		},
	],
	projects: [
		{
			name: "Design Engineering",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: Map,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			{...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
