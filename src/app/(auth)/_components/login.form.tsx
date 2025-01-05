"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed unused import
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ProvidersComponent from "./providers";
import { signIn, useSession } from "@/lib/api/auth/auth-client";
import { useSearchParams } from "next/navigation";
// Removed unused import
import LoadingIcon from "@/components/loading-icon";
import { api } from "@/trpc/react";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters long",
	}),
});
type LoginScheme = z.infer<typeof loginSchema>;

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const loginForm = useForm<LoginScheme>({
		resolver: zodResolver(loginSchema),
	});
	const searchParams = useSearchParams();
	const { isPending } = useSession();

	useEffect(() => {
		const errorParam = searchParams.get("error");
		switch (errorParam) {
			case "unauthorized":
				setError("Unauthorized");
				break;
			case "invalid":
				setError("Invalid email or password");
				break;
			case "verify":
				setError("Please verify your email address");
				break;
			case "email_not_found":
				setError("Email not found");
				break;
			default:
				break;
		}
	}, [searchParams]);

	async function onSubmit(input: LoginScheme) {
		setIsLoading(true);
		setError(null);
		const { error } = await signIn.email(
			{
				email: input.email,
				password: input.password,
				callbackURL: "/home",
			},
			{
				onError: (ctx) => {
					if (ctx.error.status === 403) {
						setError("Please verify your email address");
					}
					setError(ctx.error.message);
				},
			}
		);
		setIsLoading(false);
		if (error) {
			setError(error.message ?? "An unknown error occurred");
		}
	}

	return (
		<div className="grid gap-6">
			<Form {...loginForm}>
				<form
					onSubmit={loginForm.handleSubmit(onSubmit)}
					className="space-y-2 w-full">
					<FormField
						control={loginForm.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="email@example.com"
										value={field.value || ""}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={loginForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="••••••••"
										value={field.value || ""}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<a
						href="forgot-password"
						className="text-muted-foreground hover:underline text-xs text-right">
						Forgot Password?
					</a>
					<Button
						disabled={isLoading && !isPending}
						className="w-full">
						{isLoading && !isPending && <LoadingIcon />}
						Login
					</Button>
				</form>
			</Form>
			<ProvidersComponent />
		</div>
	);
}
