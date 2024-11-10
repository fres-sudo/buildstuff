"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkspaceOnboardingPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [workspaceData, setWorkspaceData] = useState({
		name: "",
		description: "",
	});
	const [inviteCode, setInviteCode] = useState("");

	async function onCreateWorkspace(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/workspaces", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(workspaceData),
			});

			if (response.ok) {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Error creating workspace:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function onJoinWorkspace(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch("/api/workspaces/join", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ inviteCode }),
			});

			if (response.ok) {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("Error joining workspace:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Card className="w-full max-w-[600px]">
				<CardHeader>
					<CardTitle>Welcome! Lets get started</CardTitle>
					<CardDescription>
						Create a new workspace or join an existing one
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="create">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="create">Create Workspace</TabsTrigger>
							<TabsTrigger value="join">Join Workspace</TabsTrigger>
						</TabsList>
						<TabsContent value="create">
							<form
								onSubmit={onCreateWorkspace}
								className="space-y-4 mt-4">
								<div className="space-y-2">
									<Label htmlFor="name">Workspace Name</Label>
									<Input
										id="name"
										placeholder="My Awesome Team"
										value={workspaceData.name}
										onChange={(e) =>
											setWorkspaceData({
												...workspaceData,
												name: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										placeholder="What does your team do?"
										value={workspaceData.description}
										onChange={(e) =>
											setWorkspaceData({
												...workspaceData,
												description: e.target.value,
											})
										}
									/>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}>
									{isLoading && (
										<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Workspace
								</Button>
							</form>
						</TabsContent>
						<TabsContent value="join">
							<form
								onSubmit={onJoinWorkspace}
								className="space-y-4 mt-4">
								<div className="space-y-2">
									<Label htmlFor="inviteCode">Invitation Code</Label>
									<Input
										id="inviteCode"
										placeholder="Enter your invitation code"
										value={inviteCode}
										onChange={(e) => setInviteCode(e.target.value)}
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
									Join Workspace
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
