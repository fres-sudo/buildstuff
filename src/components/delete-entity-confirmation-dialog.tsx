"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

interface DeleteEntityDialogProps {
	entityName: string;
	entityType: string;
	onDelete: () => void;
	children: React.ReactNode;
}

export default function DeleteEntityDialog({
	entityName,
	entityType,
	onDelete,
	children,
}: DeleteEntityDialogProps) {
	const [inputValue, setInputValue] = useState("");

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<div className="flex flex-col items-center gap-2">
					<div
						className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
						aria-hidden="true">
						<CircleAlert
							className="opacity-80"
							size={16}
							strokeWidth={2}
						/>
					</div>
					<DialogHeader>
						<DialogTitle className="sm:text-center">
							Final confirmation
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							This action cannot be undone. To confirm, please enter the{" "}
							{entityType} name{" "}
							<span className="text-foreground">{entityName}</span>.
						</DialogDescription>
					</DialogHeader>
				</div>

				<form className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="entity-name">{entityType} name</Label>
						<Input
							id="entity-name"
							type="text"
							placeholder={`Type ${entityName} to confirm`}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								className="flex-1">
								Cancel
							</Button>
						</DialogClose>
						<Button
							type="button"
							className="flex-1"
							disabled={inputValue !== entityName}
							onClick={onDelete}>
							Delete
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}