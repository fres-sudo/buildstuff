"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";

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

	const { isPending } = useSession();

	async function onSubmit(data: LoginScheme) {
		setIsLoading(true);
		setError(null);
		await signIn
			.email(
				{
					email: data.email,
					password: data.password,
					callbackURL: "/home",
				},
				{
					onError: (ctx) => {
						// Handle the error
						if (ctx.error.status === 403) {
							setError("Please verify your email address");
						}
						//you can also show the original error message
						alert(ctx.error.message);
					},
				}
			)
			.then(() => setIsLoading(false))
			.catch((error) => {
				setError("Invalid email or password");
			});
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
										{...field}
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
										{...field}
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
						{isLoading && !isPending && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Login
					</Button>
				</form>
			</Form>
			<ProvidersComponent />
		</div>
	);
}
