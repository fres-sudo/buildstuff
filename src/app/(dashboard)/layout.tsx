import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { CommandDialogMenu } from "@/components/cmdk";
import UserPropic from "@/components/layout/user-propic";
import { Breadcrumbs } from "@/components/breadcrumbs";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Page({ children }: any) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="border rounded-xl m-2">
				<header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						<Breadcrumbs />
					</div>
					<div className="pr-8 flex gap-4 items-center">
						<CommandDialogMenu />
						<ThemeSwitcher />
						<UserPropic />
					</div>
				</header>
				<main className="flex flex-col ">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
