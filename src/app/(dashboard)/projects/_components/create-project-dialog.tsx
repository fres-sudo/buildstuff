"use client";
import SelectOrCreateLabel from "@/components/select-or-create-label";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewProject } from "@/lib/db/schema.types";
import { newProjectSchema } from "@/lib/db/schema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Label as LabelType } from "@/lib/db/schema.types";
import { api } from "@/trpc/react";
import { z } from "zod";
import { toast } from "sonner";
import MultipleEmailFormField from "@/components/multiple-email-form-field";

const invitationFormSchema = z.object({ token: z.string() });
type InvitationFormType = z.infer<typeof invitationFormSchema>;

const CreateProjectDialog = () => {
	const createProjectMutation = api.projects.create.useMutation();
	const addLabelsMutation = api.projects.addLabels.useMutation();
	const joinProjectMutation = api.projects.join.useMutation();

	const createProjectForm = useForm<NewProject>({
		resolver: zodResolver(newProjectSchema),
	});
	const invitationForm = useForm<InvitationFormType>({
		resolver: zodResolver(invitationFormSchema),
	});

	const [labels, setLabels] = useState<LabelType[]>([]);
	const [emails, setEmails] = useState<string[]>([]);

	async function onCreateWorkspace(data: NewProject) {
		const project = await createProjectMutation.mutateAsync(data);
		if (!project) {
			toast.error("Failed to create project");
		}
		if (labels.length > 0) {
			await addLabelsMutation.mutateAsync(labels);
		}
	}

	async function onJoinWorkspace(data: InvitationFormType) {
		await joinProjectMutation.mutateAsync({
			token: data.token,
		});
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					className="p-1 m-0 rounded-full h-6 w-6"
					variant={"outline"}
					onClick={() => {}}>
					<Plus className="h-6 w-6 text-muted-foreground mx-1" />
				</Button>
			</DialogTrigger>
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
								onSubmit={createProjectForm.handleSubmit(onCreateWorkspace)}
								className="space-y-2 w-full">
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
								<FormLabel className="">Invite People</FormLabel>
								<MultipleEmailFormField
									onChangeEmails={(emails) => setEmails(emails)}
								/>

								<Button
									type="submit"
									className="w-full">
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
								onSubmit={invitationForm.handleSubmit(onJoinWorkspace)}
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
									className="w-full">
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
