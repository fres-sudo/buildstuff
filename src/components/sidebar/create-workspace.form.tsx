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
import { newWorkspaceSchema } from "@/lib/db/schema.zod";
import { NewWorkspace } from "@/lib/db/schema.types";
import { api } from "@/trpc/react";
import { create } from "domain";
import { Loader, Smile } from "lucide-react";
import { toast } from "sonner";
import { getRandomIcon } from "../random-icons";
import { EmojiSelector } from "../emoji-selector";

const CreateWorkspaceForm = () => {
	const createWorkspaceMutation = api.workspaces.create.useMutation();

	const createWorkspaceForm = useForm<NewWorkspace>({
		resolver: zodResolver(newWorkspaceSchema),
	});

	async function onCreateWorkspace(data: NewWorkspace) {
		const result = await createWorkspaceMutation.mutateAsync({
			...data,
		});
		if (!result) {
			toast.error("Failed to create workspace");
		}
		createWorkspaceForm.reset();
	}

	const onSelectEmojiHandler = (emojiCode: string) => {
		const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
		//setMessage((prevMessage) => prevMessage + emoji);
	};

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
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Workspace name"
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
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>{" "}
				<EmojiSelector
					id="edit-message-emoji-selector"
					asChild
					slide="right"
					align="end"
					onSelectedEmoji={onSelectEmojiHandler}>
					<Button
						className="w-8 h-8 sm:w-10 sm:h-10"
						size={"icon"}
						variant={"ghost"}>
						<Smile className="w-5 h-5 sm:w-auto sm:h-auto" />
					</Button>
				</EmojiSelector>
				<FormField
					control={createWorkspaceForm.control}
					name="emoji"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<EmojiSelector
									id="edit-message-emoji-selector"
									asChild
									slide="right"
									align="end"
									onSelectedEmoji={onSelectEmojiHandler}>
									<Button
										className="w-8 h-8 sm:w-10 sm:h-10"
										size={"icon"}
										variant={"ghost"}>
										<Smile className="w-5 h-5 sm:w-auto sm:h-auto" />
									</Button>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="mt-4 w-full">
					{createWorkspaceMutation.isPending && (
						<Loader
							className="mr-2 size-4 animate-spin"
							aria-hidden="true"
						/>
					)}
					{createWorkspaceMutation.isPending
						? "Creating Workspace"
						: "CreateWorkspace"}
				</Button>
			</form>
		</Form>
	);
};

export default CreateWorkspaceForm;
