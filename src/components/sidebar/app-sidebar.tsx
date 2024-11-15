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

const data = {
	user: {
		name: "fres",
		email: "fres@fres.space",
		image: "/avatars/shadcn.jpg",
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
				<WorkSpaceSwitcher workSpaces={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					items={data.navMain}
					title="Platform"
				/>
				<NavMain
					items={data.personal}
					title="Personal"
				/>
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
