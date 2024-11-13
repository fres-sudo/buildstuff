import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<h2 className="text-2xl font-bold tracking-tight m-6">
				Account Settings ⚙️
				<p className="text-sm text-muted-foreground font-thin">
					Here you can change your information, improve your plan, choose what
					you want to receive notifications about, and more.
				</p>
			</h2>
			<div className="container flex px-4 py-8 min-h-full rounded-lg border mx-4">
				<Sidebar
					collapsible="none"
					className="hidden md:flex bg-background">
					<SidebarContent>
						<SidebarGroup className="px-0">
							<SidebarGroupContent>
								<SidebarMenuButton asChild>
									<Link href="/account">Account</Link>
								</SidebarMenuButton>
								<SidebarMenuButton asChild>
									<Link href="/account/billings">Billings</Link>
								</SidebarMenuButton>
								<SidebarMenuButton asChild>
									<Link href="/account/notifications">Notifications</Link>
								</SidebarMenuButton>
								<SidebarMenuButton asChild>
									<Link href="/account/security">Security</Link>
								</SidebarMenuButton>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
				<Separator orientation="vertical" />
				{children}
			</div>
		</>
	);
}
