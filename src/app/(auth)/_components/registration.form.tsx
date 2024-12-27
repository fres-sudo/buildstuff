"use client";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TermsAndCondition from "./terms-and-condition";

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
	const searchParams = useSearchParams();

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

	async function onSubmit(input: SignUpSchema) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		const { data, error } = await signUp.email(
			{
				name: input.fullName,
				email: input.email,
				password: input.password,
				callbackURL: "/login",
			},
			{
				onError: (ctx) => {
					// Handle the error
					if (ctx.error.status === 403) {
						setError("Please verify your email address");
					}
					//you can also show the original error message
					setError(ctx.error.message);
				},
			}
		);
		if (error) {
			setError(error.message ?? "An error occurred while signing up");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full">
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem className="mb-2">
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
						<FormItem className="mb-2">
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
						<FormItem className="mb-2">
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
					<Alert
						variant="destructive"
						className="mt-4">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				{success && (
					<Alert
						variant="success"
						className="mt-4">
						<AlertCircle className="h-4 w-4 " />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>
							Account created successfully, please verify your email address.
						</AlertDescription>
					</Alert>
				)}
				<Button
					className="w-full mt-4 mb-2"
					disabled={isLoading}>
					{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
					Sign Up
				</Button>

				<p className="text-xs font-thin text-center text-muted-foreground">
					By signing in you will accept out{" "}
					<TermsAndCondition>
						<span className="hover:underline">Terms and Conditions</span>
					</TermsAndCondition>
				</p>
			</form>
		</Form>
	);
};

export default RegistrationForm;
