import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
	title: "Reset Password",
	description: "Reset your password",
};

export default function ResetPasswordPage() {
	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Reset Password
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email address and we will send you a verification code
					</p>
				</div>
				<AuthForm type="reset" />
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/login"
						className="hover:text-brand underline underline-offset-4">
						Back to Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
