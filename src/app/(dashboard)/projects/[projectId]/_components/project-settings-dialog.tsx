"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import DeleteEntityDialog from "@/components/delete-entity-confirmation-dialog";
import LoadingIcon from "@/components/loading-icon";

const projectSettingsSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.string().optional(),
	isPublic: z.boolean(),
	defaultRole: z.enum(["viewer", "editor", "admin"]),
});

type ProjectSettingsFormValues = z.infer<typeof projectSettingsSchema>;

interface ProjectSettingsDialogProps {
	project: any;
	isAdmin: boolean;
	children?: React.ReactNode;
}

export function ProjectSettingsDialog({
	project,
	isAdmin,
	children,
}: ProjectSettingsDialogProps) {
	const [open, setOpen] = useState(false);
	const updateProject = api.projects.update.useMutation();
	const deleteProject = api.projects.delete.useMutation();

	const form = useForm<ProjectSettingsFormValues>({
		resolver: zodResolver(projectSettingsSchema),
		defaultValues: {
			name: project?.name || "",
			description: project?.description || "",
			isPublic: project?.isPublic || false,
			defaultRole: project?.defaultRole || "viewer",
		},
	});

	const onSubmit = async (data: ProjectSettingsFormValues) => {
		try {
			const projectId = project.projectId as string;
			await updateProject.mutateAsync({ projectId, data });
			setOpen(false);
			toast.success("Project settings updated successfully");
		} catch (error) {
			toast.error("Failed to update project settings");
		}
	};

	const handleDeleteProject = async () => {
		try {
			await deleteProject.mutateAsync(project.projectId);
			setOpen(false);
			toast.success("Project deleted successfully");
		} catch (error) {
			toast.error("Failed to delete project");
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children ?? (
					<Button
						variant="outline"
						size="sm">
						<Settings className="mr-2 h-4 w-4" />
						Project Settings
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Project Settings</DialogTitle>
					<DialogDescription>
						Manage your project settings here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isAdmin}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											disabled={!isAdmin}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isAdmin && (
							<>
								<FormField
									control={form.control}
									name="isPublic"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													Public Project
												</FormLabel>
												<FormDescription>
													Make this project visible to non-members
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="defaultRole"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Default Member Role</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a default role" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="viewer">Viewer</SelectItem>
													<SelectItem value="editor">Editor</SelectItem>
													<SelectItem value="admin">Admin</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												Set the default role for new members
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						<DialogFooter>
							<DeleteEntityDialog
								entityName={project.name}
								entityType={"Project"}
								onDelete={handleDeleteProject}>
								{deleteProject.isPending && <LoadingIcon />}
								<Button
									disabled={deleteProject.isPending}
									variant={"destructive"}>
									Delete project
								</Button>
							</DeleteEntityDialog>
							<Button type="submit">Save Changes</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
