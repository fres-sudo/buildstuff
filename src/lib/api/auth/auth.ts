import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import { env } from "@/env";

export const auth = betterAuth({
	baseURL: env.BASE_URL || "http://localhost:3000",
	secret: env.AUTH_SECRET || undefined,
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		requireEmailVerification: true,
		sendResetPassword: async (user, url) => {
			console.log("data reset pass:", { user, url });
			/*await sendEmail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
			});*/
		},
		sendResetPasswordToken: async (user: any, url: any, token: any) => {
			console.log("data reset pass:", { user, url, token });
			/*await sendEmail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
			});*/
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url, token }) => {
			console.log("data email ver:", { user, url, token });
			/*await sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email: ${url}`,
			});*/
		},
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	socialProviders: {
		github: {
			clientId: env.AUTH_GITHUB_ID,
			clientSecret: env.AUTH_GITHUB_SECRET,
			redirectURI: env.BASE_URL + "/api/auth/callback/github",
		},
		google: {
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
			redirectURI: env.BASE_URL + "/api/auth/callback/google",
		},
	},
});
