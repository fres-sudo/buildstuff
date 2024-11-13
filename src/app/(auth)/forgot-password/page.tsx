"use client";
import Link from "next/link";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import type { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { forgetPassword } from "@/lib/api/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const resetPassSchema = z.object({
	email: z.string().email(),
});

type ResetPassSchema = zod.infer<typeof resetPassSchema>;

export default function ResetPasswordPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ResetPassSchema>({
		resolver: zodResolver(resetPassSchema),
	});

	async function onSubmit(data: ResetPassSchema) {
		setIsLoading(true);
		setError(null);
		await forgetPassword({
			email: data.email,
			redirectTo: "/reset-password",
		})
			.then(() => setIsLoading(false))
			.catch((error) => {
				setError("Invalid email or password");
			});
	}

	return (
		<div className="container flex flex-col items-center justify-center">
			<div className=" flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Reset Password
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email address and we will send you a verification code
					</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="email@example.com"
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
							className="w-full mt-4">
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Reset Password
						</Button>
					</form>
				</Form>
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
