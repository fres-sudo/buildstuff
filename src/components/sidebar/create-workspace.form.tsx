"use client";
import { useState, FormEvent } from "react";
import {
	Form,
	FormControl,
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

const CreateWorkspaceForm = () => {
	const createWorkspaceMutation = api.workspaces.create.useMutation();
	const [formData, setFormData] = useState<NewWorkspace>({
		name: "",
		description: "",
		emoji: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const onSelectEmojiHandler = (emojiCode: string) => {
		const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
		setFormData((prev) => ({
			...prev,
			emoji: emoji,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const result = await createWorkspaceMutation.mutateAsync({
				...formData,
			});
			if (!result) {
				toast.error("Failed to create workspace");
			}
			setFormData({ name: "", description: "", emoji: "" });
		} catch (error) {
			toast.error("Failed to create workspace");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4">
			<FormItem>
				<FormLabel>Name</FormLabel>
				<FormControl>
					<Input
						name="name"
						placeholder="Workspace name"
						value={formData.name}
						onChange={handleInputChange}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>

			<FormItem>
				<FormLabel>Description</FormLabel>
				<FormControl>
					<Textarea
						name="description"
						placeholder="Tell us a little bit about your workspace"
						className="resize-none"
						value={formData.description ?? ""}
						onChange={handleInputChange}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>

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
					</EmojiSelector>
				</FormControl>
				<FormMessage />
			</FormItem>

			<Button
				className="mt-4 w-full"
				type="submit">
				{createWorkspaceMutation.isPending && (
					<Loader
						className="mr-2 size-4 animate-spin"
						aria-hidden="true"
					/>
				)}
				{createWorkspaceMutation.isPending
					? "Creating Workspace"
					: "Create Workspace"}
			</Button>
		</form>
	);
};

export default CreateWorkspaceForm;
