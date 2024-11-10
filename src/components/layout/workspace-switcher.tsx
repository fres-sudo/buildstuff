"use client";

import * as React from "react";
import {
	CaretSortIcon,
	CheckIcon,
	PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type Workspace = {
	id: string;
	name: string;
	description?: string;
};

interface WorkspaceSwitcherProps {
	workspaces: Workspace[];
	currentWorkspace?: Workspace;
	onWorkspaceChange?: (workspace: Workspace) => void;
}

export function WorkspaceSwitcher({
	workspaces,
	currentWorkspace,
	onWorkspaceChange,
}: WorkspaceSwitcherProps) {
	const [open, setOpen] = React.useState(false);
	const [showNewWorkspaceDialog, setShowNewWorkspaceDialog] =
		React.useState(false);

	return (
		<Dialog
			open={showNewWorkspaceDialog}
			onOpenChange={setShowNewWorkspaceDialog}>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a workspace"
						className="w-[200px] justify-between">
						<Avatar className="mr-2 h-5 w-5">
							<AvatarFallback>
								{currentWorkspace?.name.charAt(0) || "W"}
							</AvatarFallback>
						</Avatar>
						{currentWorkspace?.name}
						<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search workspace..." />
							<CommandEmpty>No workspace found.</CommandEmpty>
							<CommandGroup heading="Workspaces">
								{workspaces.map((workspace) => (
									<CommandItem
										key={workspace.id}
										onSelect={() => {
											onWorkspaceChange?.(workspace);
											setOpen(false);
										}}
										className="text-sm">
										<Avatar className="mr-2 h-5 w-5">
											<AvatarFallback>
												{workspace.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										{workspace.name}
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4",
												currentWorkspace?.id === workspace.id
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
						<CommandSeparator />
						<CommandList>
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false);
										setShowNewWorkspaceDialog(true);
									}}>
									<PlusCircledIcon className="mr-2 h-5 w-5" />
									Create Workspace
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create workspace</DialogTitle>
					<DialogDescription>
						Add a new workspace to manage projects and teams.
					</DialogDescription>
				</DialogHeader>
				<div>
					<div className="space-y-4 py-2 pb-4">
						<div className="space-y-2">
							<Label htmlFor="name">Workspace name</Label>
							<Input
								id="name"
								placeholder="Acme Inc."
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="Team projects and tasks"
							/>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setShowNewWorkspaceDialog(false)}>
						Cancel
					</Button>
					<Button type="submit">Create</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
