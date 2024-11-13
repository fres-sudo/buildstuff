import { type DefaultSession, type NextAuthConfig } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			emailVerified: Date | null;
			password: string | null;
			role: string | null;
			workType: string | null;
		} & DefaultSession["user"];
	}
	interface User {
		id: string;
		name: string | null;
		email: string;
		emailVerified: Date | null;
		image: string | null;
		password: string | null;
		role: string | null;
		workType: string | null;
	}
}
