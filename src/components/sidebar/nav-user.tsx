"use client";

import {
	BadgeCheck,
	Bell,
	Bot,
	Check,
	ChevronsUpDown,
	CreditCard,
	Link,
	LogOut,
	Sidebar,
	Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/api/auth/auth-client";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { data: session } = useSession();

	const router = useRouter();

	if (!session)
		return (
			<SidebarMenuButton>
				<div className="flex items-center gap-2 p-2">
					<Skeleton className="h-8 w-8 rounded-lg" />
					<div className="hidden lg:grid flex-1 gap-1">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-2 w-32" />
					</div>
				</div>
			</SidebarMenuButton>
		);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="h-8 w-8 rounded-lg">
								{session.user.image ? (
									<AvatarImage
										src={session.user.image}
										alt={session.user.name}
									/>
								) : (
									<AvatarFallback className="rounded-lg">
										{session.user.name[0]}
									</AvatarFallback>
								)}
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{session.user.name}
								</span>
								<span className="truncate text-xs">{session.user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{session.user.image ? (
										<AvatarImage
											src={session.user.image}
											alt={session.user.name}
										/>
									) : (
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									)}
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{session.user.name}
									</span>
									<span className="truncate text-xs">{session.user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => {
									router.push("/#pricing");
								}}>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => {
									router.push("/account");
								}}>
								<Bot />
								Help
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									router.push("/account/billings");
								}}>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									router.push("/account/notifications");
								}}>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={async () =>
								await signOut({
									fetchOptions: {
										onSuccess: () => {
											localStorage.clear();
											router.push("/login");
										},
									},
								})
							}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
