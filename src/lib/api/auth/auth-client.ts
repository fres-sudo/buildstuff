import { createAuthClient } from "better-auth/react";
import { env } from "@/env";

export const {
	signIn,
	signUp,
	forgetPassword,
	resetPassword,
	signOut,
	useSession,
} = createAuthClient({
	baseURL: "http://localhost:3000",
});
