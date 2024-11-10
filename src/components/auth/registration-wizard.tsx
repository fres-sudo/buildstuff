"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type RegistrationWizardProps = React.HTMLAttributes<HTMLDivElement>;

const workTypes = [
	"Developer",
	"Designer",
	"Product Manager",
	"Project Manager",
	"Business Analyst",
	"QA Engineer",
	"DevOps Engineer",
	"Other",
];

const roles = [
	"Individual Contributor",
	"Team Lead",
	"Manager",
	"Director",
	"Executive",
	"Freelancer",
	"Consultant",
];

export function RegistrationWizard({
	className,
	...props
}: RegistrationWizardProps) {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		name: "",
		password: "",
		role: "",
		workType: "",
	});

	const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>("");

	async function onSubmitEmail(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/check-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: formData.email }),
			});

			if (response.ok) {
				setStep(2);
			} else {
				const data = await response.json();
				if (data.error === "User exists") {
					router.push("/auth/login");
				}
			}
		} catch (error) {
			console.error("Error checking email:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function onSubmitDetails(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					workType: selectedWorkTypes.join(","),
					role: selectedRole,
				}),
			});

			if (response.ok) {
				await signIn("credentials", {
					email: formData.email,
					password: formData.password,
					callbackUrl: "/onboarding/workspace",
				});
			}
		} catch (error) {
			console.error("Registration error:", error);
		} finally {
			setIsLoading(false);
		}
	}

	const handleWorkTypeToggle = (type: string) => {
		setSelectedWorkTypes((prev) =>
			prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
		);
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<form
						onSubmit={onSubmitEmail}
						className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								required
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Continue
						</Button>
					</form>
				);

			case 2:
				return (
					<form
						onSubmit={onSubmitDetails}
						className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								placeholder="John Doe"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label>Your Role</Label>
							<div className="flex flex-wrap gap-2">
								{roles.map((role) => (
									<Badge
										key={role}
										variant={selectedRole === role ? "default" : "outline"}
										className="cursor-pointer"
										onClick={() => setSelectedRole(role)}>
										{role}
									</Badge>
								))}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Work Type</Label>
							<div className="flex flex-wrap gap-2">
								{workTypes.map((type) => (
									<Badge
										key={type}
										variant={
											selectedWorkTypes.includes(type) ? "default" : "outline"
										}
										className="cursor-pointer"
										onClick={() => handleWorkTypeToggle(type)}>
										{type}
									</Badge>
								))}
							</div>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create Account
						</Button>
					</form>
				);

			default:
				return null;
		}
	};

	return (
		<div
			className={cn("grid gap-6", className)}
			{...props}>
			{renderStep()}
		</div>
	);
}
