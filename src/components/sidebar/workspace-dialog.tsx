"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Icons } from "../icons";
import CreateWorkspaceForm from "./create-workspace.form";

const WorkSpaceDialog = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [workspaceData, setWorkspaceData] = useState({
		name: "",
		description: "",
	});
	const [inviteCode, setInviteCode] = useState("");

	function onCreateWorkspace() {}
	function onJoinWorkspace() {}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="gap-2 p-2 flex">
					<div className="flex size-6 items-center justify-center rounded-md border bg-background">
						<Plus className="size-4" />
					</div>
					<p className="font-medium text-md text-muted-foreground">
						Add work space
					</p>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Create Workspace</DialogTitle>
					<DialogDescription>
						Create a new workspace or join an existing one{" "}
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="create">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="create">Create Workspace</TabsTrigger>
						<TabsTrigger value="join">Join Workspace</TabsTrigger>
					</TabsList>
					<TabsContent value="create">
						<CreateWorkspaceForm />
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
			</DialogContent>
		</Dialog>
	);
};

export default WorkSpaceDialog;
