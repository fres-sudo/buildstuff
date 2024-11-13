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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { resetPassword } from "@/lib/api/auth/auth-client";
import { Checkbox } from "@/components/ui/checkbox";

const resetPassSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
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
		try {
			await resetPassword({
				newPassword: data.password,
			});
			setIsLoading(false);
		} catch (error) {
			setError("Failed to reset password");
			setIsLoading(false);
		}
	}

	return (
		<div className="container flex flex-col items-center justify-center">
			<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">
						Reset Password
					</h1>
					<p className="text-sm text-muted-foreground">
						Enter your new password
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter new password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Confirm new password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && (
							<p className="text-sm text-red-500 text-center">{error}</p>
						)}
						<Button
							type="submit"
							className="w-full mt-4"
							disabled={isLoading}>
							{isLoading ? "Resetting..." : "Reset Password"}
						</Button>
					</form>
				</Form>
				<p className="px-8 text-center text-sm text-muted-foreground mt-4">
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
