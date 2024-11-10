import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/lib/server/db";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { users } from "@/lib/server/db/schema";
import bcrypt from "bcryptjs";
import { env } from "@/env";
import type { Adapter } from "next-auth/adapters";

import { AuthOptions, NextAuthOptions } from "next-auth";

export const authConfig = {
	adapter: DrizzleAdapter(db) as Adapter,
	pages: {
		signIn: "/login",
		error: "/error",
	},
	providers: [
		GitHub({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
		Google({
			clientId: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET,
		}),
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await db.query.users.findFirst({
						where: eq(users.email, email),
					});
					if (!user) return null;
					const passwordsMatch = await bcrypt.compare(
						password,
						user.password || ""
					);
					if (passwordsMatch) return user;
				}

				console.log("Invalid credentials");
				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, token }: any) {
			if (token.sub && session.user) {
				session.user.email = token.sub;
			}
			return session;
		},
		async jwt({ token, user }: any) {
			if (user) {
				token.sub = user.id;
			}
			return token;
		},
	},
} satisfies NextAuthOptions;
