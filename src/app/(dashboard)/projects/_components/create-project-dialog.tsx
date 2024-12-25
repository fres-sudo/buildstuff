"use client";
import SelectOrCreateLabel from "@/components/select-or-create-label";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NewProject } from "@/lib/db/schema.types";
import { newProjectSchema } from "@/lib/db/zod.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Label as LabelType } from "@/lib/db/schema.types";
import { api } from "@/trpc/react";
import { z } from "zod";
import { toast } from "sonner";
import MultipleEmailFormField from "@/components/multiple-email-form-field";
import { useWorkspace } from "@/hooks/use-workspace";
import { Separator } from "@radix-ui/react-separator";
import SelectMultipleMembersDropdown from "@/components/select-multiple-members-dropdowx";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const invitationFormSchema = z.object({ token: z.string() });
type InvitationFormType = z.infer<typeof invitationFormSchema>;

const CreateProjectDialog = ({
	onProjectCreated,
	children,
	buttonClassname,
	buttonVariant,
}: {
	onProjectCreated: (project: NewProject) => void;
	children?: React.ReactNode;
	buttonClassname?: string;
	buttonVariant?:
		| "link"
		| "default"
		| "destructive"
		| "outline"
		| "secondary"
		| "ghost"
		| null
		| undefined;
}) => {
	const createProjectMutation = api.projects.create.useMutation();
	const addLabelsMutation = api.projects.addLabels.useMutation();
	const joinProjectMutation = api.projects.join.useMutation();
	const inviteGeustsMutatoin = api.projects.inviteGuests.useMutation();
	const inviteMembersMutation = api.projects.inviteMembers.useMutation();

	const createProjectForm = useForm<NewProject>({
		resolver: zodResolver(newProjectSchema),
	});
	const invitationForm = useForm<InvitationFormType>({
		resolver: zodResolver(invitationFormSchema),
	});

	const { currentWorkspace } = useWorkspace();
	const [labels, setLabels] = useState<LabelType[]>([]);
	const [emails, setEmails] = useState<string[]>([]);
	const [members, setMember] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	async function onCreateProject(data: NewProject) {
		const project = await createProjectMutation.mutateAsync({
			...data,
			workspaceId: currentWorkspace?.id,
		});
		if (!project || !project.id) {
			toast.error("Failed to create project");
			setOpen(false);
			createProjectForm.reset();
			return;
		}
		await Promise.all([
			labels.length > 0 &&
				addLabelsMutation.mutateAsync({
					projectId: project.id,
					labelIds: labels.map((l) => l.id),
				}),
			emails.length > 0 &&
				inviteGeustsMutatoin.mutateAsync({
					projectId: project.id,
					emails,
				}),
			members.length > 0 &&
				inviteMembersMutation.mutateAsync({
					projectId: project.id,
					memberIds: members,
				}),
		]);
		onProjectCreated(project);
		setOpen(false);
		createProjectForm.reset();
	}

	async function onJoinProject(data: InvitationFormType) {
		await joinProjectMutation.mutateAsync({
			token: data.token,
		});
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<Button
				className={buttonClassname ?? "p-1 m-0 rounded-full h-6 w-6"}
				variant={buttonVariant ?? "outline"}
				onClick={() => {
					setOpen(true);
				}}>
				{children ?? <Plus className="h-6 w-6 text-muted-foreground mx-1" />}
			</Button>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Create Project</DialogTitle>
					<DialogDescription>
						Create a new project or join an existing one{" "}
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="create">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="create">Create Project</TabsTrigger>
						<TabsTrigger value="join">Join Project</TabsTrigger>
					</TabsList>
					<TabsContent value="create">
						<Form {...createProjectForm}>
							<form
								onSubmit={createProjectForm.handleSubmit(onCreateProject)}
								className="w-full space-y-2">
								<FormField
									control={createProjectForm.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Project Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Something really cool"
													{...field}
													value={field.value ?? ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<SelectOrCreateLabel
									onLabelSelect={(labels) => setLabels(labels)}
								/>
								<SelectMultipleMembersDropdown
									onMembersChange={(members) =>
										setMember(members.map((m) => m.id))
									}
								/>
								<FormDescription>
									Invite people that are already part of the current Workspace
									to collaborate on this project.
								</FormDescription>
								<MultipleEmailFormField
									onChangeEmails={(emails) => setEmails(emails)}
								/>
								<Button
									type="submit"
									className="w-full mt-4">
									{createProjectMutation.isPending && (
										<Loader className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Project
								</Button>
							</form>
						</Form>
					</TabsContent>
					<TabsContent value="join">
						<Form {...invitationForm}>
							<form
								onSubmit={invitationForm.handleSubmit(onJoinProject)}
								className="space-y-4 mt-4">
								<FormField
									control={invitationForm.control}
									name="token"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Invitation Code</FormLabel>
											<FormControl>
												<Input
													placeholder="Insert here your invitation code"
													{...field}
													value={field.value ?? ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full mt-2">
									{joinProjectMutation.isPending && (
										<Loader className="mr-2 h-4 w-4 animate-spin" />
									)}
									Join Project
								</Button>
							</form>
						</Form>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default CreateProjectDialog;
