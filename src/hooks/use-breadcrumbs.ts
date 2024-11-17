"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
	title: string;
	link: string;
};

const homeRoute = { title: "Home", link: "/home" };
const todoRoute = { title: "Todos", link: "/todos" };
const myTaskRoute = { title: "My Tasks", link: "/my-tasks" };
const messagesRoute = { title: "Messages", link: "/messages" };
const accountRoute = { title: "Account", link: "/account" };
const billingRoute = { title: "Billing", link: "/account/billing" };
const securityRoute = { title: "Security", link: "/account/security" };
const notificationsRoute = {
	title: "Notifications",
	link: "/account/notifications",
};
const timesheetsRoute = { title: "Timesheets", link: "/timesheets" };
const projectsRoute = { title: "Projects", link: "/projects" };
const inboxRoute = { title: "Inbox", link: "/inbox" };
const analyticsRoute = { title: "Analytics", link: "/analytics" };

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
	"/home": [homeRoute],
	"/todos": [homeRoute, todoRoute],
	"/product": [homeRoute],
	"/messages": [homeRoute, messagesRoute],
	"/account": [homeRoute, accountRoute],
	"/account/billing": [homeRoute, accountRoute, billingRoute],
	"/account/security": [homeRoute, accountRoute, securityRoute],
	"/account/notifications": [homeRoute, accountRoute, notificationsRoute],
	"/timesheets": [homeRoute, timesheetsRoute],
	"/projects": [homeRoute, projectsRoute],
	"/inbox": [homeRoute, inboxRoute],
	"/analytics": [homeRoute, analyticsRoute],
	"/my-tasks": [homeRoute, myTaskRoute],
};

export function useBreadcrumbs() {
	const pathname = usePathname();

	const breadcrumbs = useMemo(() => {
		// Check if we have a custom mapping for this exact path
		if (routeMapping[pathname]) {
			return routeMapping[pathname];
		}

		// If no exact match, fall back to generating breadcrumbs from the path
		const segments = pathname.split("/").filter(Boolean);
		return segments.map((segment, index) => {
			const path = `/${segments.slice(0, index + 1).join("/")}`;
			return {
				title: segment.charAt(0).toUpperCase() + segment.slice(1),
				link: path,
			};
		});
	}, [pathname]);

	return breadcrumbs;
}
