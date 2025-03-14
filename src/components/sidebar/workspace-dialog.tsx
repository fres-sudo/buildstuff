"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import CreateWorkspaceForm from "./create-workspace.form";
import { api } from "@/trpc/react";
import { NewWorkspace } from "@/lib/db/schema.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newWorkspaceSchema } from "@/lib/db/zod.schema";
import { Textarea } from "../ui/textarea";
import LoadingIcon from "../loading-icon";

const WorkSpaceDialog = () => {
	const createWorkspaceMutation = api.workspaces.create.useMutation();
	const [inviteCode, setInviteCode] = useState("");
	const form = useForm<NewWorkspace>({
		resolver: zodResolver(newWorkspaceSchema),
	});
	const [open, setOpen] = useState(false);

	async function onCreateWorkspace(data: NewWorkspace) {
		await createWorkspaceMutation.mutateAsync(data);
	}

	function onJoinWorkspace() {}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<div className="gap-2 items-center m-2 flex">
					<Plus className="size-4" />
					<p className="text-sm ">Add Workspace</p>
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
								disabled={createWorkspaceMutation.isPending}>
								{createWorkspaceMutation.isPending && <LoadingIcon />}
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
