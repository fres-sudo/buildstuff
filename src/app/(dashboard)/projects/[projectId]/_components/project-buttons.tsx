"use client";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/trpc/react";
import {
	Archive,
	ArchiveX,
	Menu,
	Pin,
	PinOff,
	Settings,
	Share2,
	UserPlus,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectSettingsDialog } from "./project-settings-dialog";
import LoadingIcon from "@/components/loading-icon";

const ProjectButtons = ({ project }: { project: any }) => {
	const updateProjectMutation = api.projects.update.useMutation();

	return (
		<>
			<div className="space-x-2 hidden md:flex ">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size={"icon"}
							variant={"outline"}>
							<Share2 />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Share Project</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => {
								updateProjectMutation.mutateAsync({
									projectId: project.id,
									data: {
										name: project.name,
										archived: !project.archived,
									},
								});
							}}
							size={"icon"}
							variant={"outline"}>
							{updateProjectMutation.isPending ? (
								<LoadingIcon />
							) : project.archived ? (
								<ArchiveX />
							) : (
								<Archive />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{project.archived ? "Unarchive" : "Archive"}
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => {
								updateProjectMutation.mutateAsync({
									projectId: project.id,
									data: {
										name: project.name,
										pinned: !project.pinned,
									},
								});
							}}
							size={"icon"}
							variant={"outline"}>
							{updateProjectMutation.isPending ? (
								<LoadingIcon />
							) : project.pinned ? (
								<PinOff />
							) : (
								<Pin />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>{project.pinned ? "Unpin" : "Pin"}</TooltipContent>
				</Tooltip>
				<Button
					size={"sm"}
					variant={"outline"}>
					<UserPlus />
					Invite
				</Button>
				<ProjectSettingsDialog
					project={project}
					isAdmin={true}>
					<Button
						size={"sm"}
						variant={"outline"}>
						<Settings />
						Settings
					</Button>
				</ProjectSettingsDialog>
			</div>
			<div className="flex md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant={"outline"}>
							<Menu />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="end"
						sideOffset={4}>
						<DropdownMenuGroup>
							<DropdownMenuItem>
								{updateProjectMutation.isPending ? (
									<LoadingIcon />
								) : project.archived ? (
									<ArchiveX />
								) : (
									<Archive />
								)}
								{project.archived ? "Unarchive" : "Archive"}
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuGroup>
							<DropdownMenuItem>
								{updateProjectMutation.isPending ? (
									<LoadingIcon />
								) : project.pinned ? (
									<PinOff />
								) : (
									<Pin />
								)}
								{project.pinned ? "Unpin" : "Pin"}
							</DropdownMenuItem>
							<DropdownMenuItem>
								<UserPlus />
								Invite
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<ProjectSettingsDialog
							project={project}
							isAdmin={true}>
							<DropdownMenuItem>
								<Settings />
								Settings
							</DropdownMenuItem>
						</ProjectSettingsDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</>
	);
};

export default ProjectButtons;
