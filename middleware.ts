import { apiAuthPrefix, authRoutes, publicRoutes } from "@/lib/routes";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

const privateRoutes = ["/home", "/profile", "/settings"]; // Define your private routes here

export default async function authMiddleware(request: NextRequest) {
	const { nextUrl } = request;
	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: request.nextUrl.origin,
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		}
	);

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute && isPublicRoute) {
		return NextResponse.next();
	}
	if (!session && (isAuthRoute || isPrivateRoute)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/home", "/profile", "/settings"], // Add your private routes here
};
