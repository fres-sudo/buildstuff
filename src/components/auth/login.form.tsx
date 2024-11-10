"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import router from "next/router";
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
import { api } from "@/trpc/server";
import { signIn } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

	async function onSubmit(data: LoginScheme) {
		setIsLoading(true);
		setError(null);
		try {
			const response = await signIn("email", {
				email: data.email,
				password: data.password,
				redirect: false,
			});
			if (response?.error) {
				setError(response.error);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			setError("Invalid email or password");
			console.error("Error log in:", error);
		} finally {
			setIsLoading(false);
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
					<Button
						disabled={isLoading}
						className="w-full">
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Login
					</Button>
				</form>
			</Form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button
					variant="outline"
					disabled={isLoading}
					onClick={() => signIn("github", { callbackUrl: "/profile" })}>
					{isLoading ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.gitHub className="mr-2 h-4 w-4" />
					)}
					GitHub
				</Button>
				<Button
					variant="outline"
					disabled={isLoading}
					onClick={() => signIn("google")}>
					{isLoading ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.google className="mr-2 h-4 w-4" />
					)}
					Google
				</Button>
			</div>
		</div>
	);
}
