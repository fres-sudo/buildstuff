"use client";
import React, { useState } from "react";
import {
	ChevronRight,
	ChevronLeft,
	Plus,
	X,
	Briefcase,
	Building,
	AlertCircle,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CircularProgress from "./circular-progress";

const RegistrationWizard = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [emailInvites, setEmailInvites] = useState([""]);
	const [workspaceType, setWorkspaceType] = useState("create");
	const [error, setError] = useState<string | null>(null);

	const calculateProgress = () => {
		return (currentStep / 4) * 100;
	};

	const roles = [
		"Designer",
		"Developer",
		"Product Manager",
		"Project Manager",
		"Marketing Specialist",
		"Business Analyst",
	];

	const workTypes = [
		"Marketing",
		"Financial",
		"Engineering",
		"Software Development",
		"Arts & Design",
		"Sales",
	];

	const handleAddEmailInvite = () => {
		setEmailInvites([...emailInvites, ""]);
	};

	const handleRemoveEmailInvite = (index: number) => {
		const newEmails = emailInvites.filter((_, i) => i !== index);
		setEmailInvites(newEmails);
	};

	const handleNext = async () => {
		setCurrentStep((prev) => Math.min(prev + 1, 4));
	};

	const handleBack = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="">
						<CardHeader>
							<CardTitle>Enter your email</CardTitle>
						</CardHeader>
						<CardContent>
							<Input
								type="email"
								placeholder="Enter your email"
								className="w-full"
							/>
						</CardContent>
					</div>
				);

			case 2:
				return (
					<div className="space-y-4">
						<CardHeader>
							<CardTitle>Create your account</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Input
								type="text"
								placeholder="Full name"
								className="w-full"
							/>
							<Input
								type="password"
								placeholder="Password"
								className="w-full"
							/>
						</CardContent>
					</div>
				);

			case 3:
				return (
					<div className="space-y-4">
						<CardHeader>
							<CardTitle>Your role</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select your role" />
								</SelectTrigger>
								<SelectContent>
									{roles.map((role) => (
										<SelectItem
											key={role}
											value={role.toLowerCase()}>
											{role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select work type" />
								</SelectTrigger>
								<SelectContent>
									{workTypes.map((type) => (
										<SelectItem
											key={type}
											value={type.toLowerCase()}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</CardContent>
					</div>
				);

			case 4:
				return (
					<div className="space-y-4">
						<CardHeader>
							<CardTitle>Workspace setup</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs
								value={workspaceType}
								onValueChange={setWorkspaceType}>
								<TabsList className="w-full">
									<TabsTrigger
										value="create"
										className="flex-1">
										<Building className="mr-2 h-4 w-4" />
										Create workspace
									</TabsTrigger>
									<TabsTrigger
										value="join"
										className="flex-1">
										<Briefcase className="mr-2 h-4 w-4" />
										Join workspace
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="create"
									className="space-y-4">
									<Input
										type="text"
										placeholder="Workspace name"
										className="w-full"
									/>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select workspace icon" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="building">🏢 Building</SelectItem>
											<SelectItem value="rocket">🚀 Rocket</SelectItem>
											<SelectItem value="star">⭐ Star</SelectItem>
										</SelectContent>
									</Select>

									<div className="space-y-2">
										{emailInvites.map((email, index) => (
											<div
												key={index}
												className="flex gap-2">
												<Input
													type="email"
													placeholder="Invite member by email"
													className="flex-1"
												/>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleRemoveEmailInvite(index)}>
													<X className="h-4 w-4" />
												</Button>
											</div>
										))}
										<Button
											variant="outline"
											onClick={handleAddEmailInvite}
											className="w-full">
											<Plus className="mr-2 h-4 w-4" />
											Add another member
										</Button>
									</div>
								</TabsContent>

								<TabsContent value="join">
									<Input
										type="text"
										placeholder="Paste your invite link"
										className="w-full"
									/>
								</TabsContent>
							</Tabs>
						</CardContent>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<Card className="w-full max-w-lg mx-auto">
			<div className="">
				{renderStep()}
				<CardFooter className="flex flex-col justify-between">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<div className="flex w-full justify-between">
						{currentStep !== 1 && (
							<Button
								variant="outline"
								onClick={handleBack}>
								<ChevronLeft className="mr-2 h-4 w-4" /> Back
							</Button>
						)}

						<Button
							onClick={handleNext}
							className={currentStep === 1 ? "w-full" : ""}
							disabled={currentStep === 4}>
							{currentStep === 1 ? (
								<>Continue</>
							) : currentStep < 4 ? (
								<>
									Next <ChevronRight className="ml-2 h-4 w-4" />
								</>
							) : (
								"Complete"
							)}
						</Button>
					</div>

					<Separator className="my-3" />
					<div className=" flex items-center gap-1">
						<p className="text-sm text-gray-500">Step {currentStep} of 4</p>
						<CircularProgress progress={calculateProgress()} />
					</div>
				</CardFooter>
			</div>
		</Card>
	);
};

export default RegistrationWizard;
