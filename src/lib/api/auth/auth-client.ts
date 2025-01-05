import { createAuthClient } from "better-auth/react";

export const {
  signIn,
  signUp,
  forgetPassword,
  resetPassword,
  signOut,
  useSession,
  verifyEmail,
} = createAuthClient({
  baseURL: "http://localhost:3000",
});
