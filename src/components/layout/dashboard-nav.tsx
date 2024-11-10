"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "@/components/icons";
import { useState } from "react";

interface NavItem {
	title: string;
	href: string;
	icon?: keyof typeof Icons;
}

interface DashboardNavProps {
	items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
	const path = usePathname();
	const [open, setOpen] = useState(false);

	return (
		<>
			<nav className="hidden lg:flex flex-col space-y-2">
				{items.map((item) => {
					const Icon = item.icon && Icons[item.icon];
					return (
						<Link
							key={item.href}
							href={item.href}>
							<span
								className={cn(
									"group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
									path === item.href ? "bg-accent" : "transparent"
								)}>
								{Icon && <Icon className="mr-2 h-4 w-4" />}
								<span>{item.title}</span>
							</span>
						</Link>
					);
				})}
			</nav>
			<Sheet
				open={open}
				onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						className="lg:hidden"
						size="sm"
						onClick={() => setOpen(true)}>
						<Icons.spinner className="h-5 w-5" />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="w-72">
					<ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
						<div className="flex flex-col space-y-2">
							{items.map((item) => {
								const Icon = item.icon && Icons[item.icon];
								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setOpen(false)}>
										<span
											className={cn(
												"group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
												path === item.href ? "bg-accent" : "transparent"
											)}>
											{Icon && <Icon className="mr-2 h-4 w-4" />}
											<span>{item.title}</span>
										</span>
									</Link>
								);
							})}
						</div>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</>
	);
}
