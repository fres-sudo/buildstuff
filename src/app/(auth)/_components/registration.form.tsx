"use client";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/api/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	fullName: z
		.string()
		.min(3, { message: "Full name must be at least 3 characters long" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const RegistrationForm = () => {
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	async function onSubmit(data: SignUpSchema) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		await signUp
			.email(
				{
					name: data.fullName,
					email: data.email,
					password: data.password,
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
			.then((_) => {
				setIsLoading(false);
				setSuccess(true);
			})
			.catch((error) => {
				setError("Invalid email or password");
			});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-2 w-full">
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Jhon Doe"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
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
					control={form.control}
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
				{success && (
					<Alert variant="success">
						<AlertCircle className="h-4 w-4 " />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>
							Account created successfully, please verify your email address.
						</AlertDescription>
					</Alert>
				)}
				<Button
					className="w-full "
					disabled={isLoading}>
					{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
					Sign Up
				</Button>
			</form>
		</Form>
	);
};

export default RegistrationForm;
