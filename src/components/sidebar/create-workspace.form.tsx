"use client";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "@/lib/dtos/workspaces.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ColorRadio from "../ui/color-radio";

type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

const CreateWorkspaceForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createWorkspaceForm = useForm<CreateWorkspaceSchema>({
		resolver: zodResolver(createWorkspaceSchema),
	});

	async function onCreateWorkspace(data: CreateWorkspaceSchema) {
		setIsLoading(true);
	}

	return (
		<Form {...createWorkspaceForm}>
			<form
				onSubmit={createWorkspaceForm.handleSubmit(onCreateWorkspace)}
				className="space-y-4">
				<FormField
					control={createWorkspaceForm.control}
					name="name"
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
					control={createWorkspaceForm.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Tell us a little bit about yout workspace"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createWorkspaceForm.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<ColorRadio
									defaultValue="blue"
									onColorChange={(color) => field.onChange(color)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="mt-4 w-full">Create workspace</Button>
			</form>
		</Form>
	);
};

export default CreateWorkspaceForm;
