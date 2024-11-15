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

const emailSchema = z.object({
	email: z.string().email(),
});
type EmailSchema = z.infer<typeof emailSchema>;

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
	type: "login" | "register" | "reset";
}

export function AuthForm({ className, type, ...props }: AuthFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const emailForm = useForm<EmailSchema>({
		resolver: zodResolver(emailSchema),
	});

	async function onSubmit(data: EmailSchema) {
		setIsLoading(true);
		try {
			const response = await api.auth.checkEmail(data);

			if (response.success) {
			} else {
				if (response.message === "User exists") {
					router.push("/auth/login");
				}
			}
		} catch (error) {
			console.error("Error checking email:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div
			className={cn("grid gap-6", className)}
			{...props}>
			<Form {...emailForm}>
				<form
					onSubmit={emailForm.handleSubmit(onSubmit)}
					className="space-y-2 w-full">
					<FormField
						control={emailForm.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
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
					<Button
						disabled={isLoading}
						className="w-full">
						{isLoading && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						Continue
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
					disabled={isLoading}>
					{isLoading ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.gitHub className="mr-2 h-4 w-4" />
					)}
					GitHub
				</Button>
				<Button
					variant="outline"
					disabled={isLoading}>
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
