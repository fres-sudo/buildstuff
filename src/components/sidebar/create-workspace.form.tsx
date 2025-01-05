"use client";
import { useState, FormEvent } from "react";
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
import { NewWorkspace } from "@/lib/db/schema.types";
import { api } from "@/trpc/react";
import { Loader, Smile } from "lucide-react";
import { toast } from "sonner";
import { EmojiSelector } from "../emoji-selector";
import LoadingIcon from "../loading-icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newWorkspaceSchema } from "@/lib/db/zod.schema";
import { on } from "events";
import { useChangeCodeToEmoji } from "@/hooks/use-change-code-to-emoji";

const CreateWorkspaceForm = () => {
	const createWorkspaceMutation = api.workspaces.create.useMutation();

	const form = useForm<NewWorkspace>({
		resolver: zodResolver(newWorkspaceSchema),
	});

	async function onCreateWorkspace(data: NewWorkspace) {
		try {
			const result = await createWorkspaceMutation.mutateAsync(data);
			if (!result) {
				toast.error("Failed to create workspace");
			}
			form.reset();
		} catch (error) {
			toast.error("Failed to create workspace");
		}
	}

	const onSelectEmojiHandler = (emojiCode: string) => {
		const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
		form.setValue("emoji", emoji);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onCreateWorkspace)}
				className="space-y-4">
				<div className="flex w-full gap-2 items-center justify-center mt-4">
					<FormField
						control={form.control}
						name="emoji"
						render={({ field }) => (
							<FormItem className="border rounded-lg">
								<FormControl>
									<EmojiSelector
										id="edit-message-emoji-selector"
										asChild
										slide="right"
										align="end"
										onSelectedEmoji={onSelectEmojiHandler}>
										<Button
											className="w-8 h-8 sm:w-10 sm:h-10 text-xl"
											size={"icon"}
											variant={"ghost"}>
											{form.getValues().emoji ?? "✳️"}
										</Button>
									</EmojiSelector>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										className="w-full"
										placeholder="Workspace name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder="Tell us a little bit about your workspace"
									className="resize-none"
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className="mt-4 w-full"
					type="submit">
					{createWorkspaceMutation.isPending && <LoadingIcon />}
					{createWorkspaceMutation.isPending
						? "Creating Workspace"
						: "Create Workspace"}
				</Button>
			</form>
		</Form>
	);
};

export default CreateWorkspaceForm;
