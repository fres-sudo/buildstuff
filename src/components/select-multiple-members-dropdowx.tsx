import { Label } from "@/components/ui/label";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import MultipleSelector, { Option } from "./ui/multiselect";
import { Button } from "./ui/button";
import {
	NewProjectMember,
	NewWorkspaceMember,
	User,
	WorkspaceMember,
} from "@/lib/db/schema.types";
import { Check, ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@/lib/api/auth/auth-client";

export default function SelectMultipleMembersDropdown({
	onMembersChange,
	title,
}: {
	title?: string;
	onMembersChange: (members: User[]) => void;
}) {
	const { currentWorkspace } = useWorkspace();
	const { data: session } = useSession();
	const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
	if (!currentWorkspace) return null;

	const query = api.workspaces.getMembers.useQuery({
		workspaceId: currentWorkspace.id,
	});

	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="space-y-2">
			<Label htmlFor="select-42">{title ?? "Add Members"}</Label>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-start bg-background px-3 font-normal hover:bg-background">
						<div className="flex flex-wrap gap-1">
							{selectedMembers.length > 0 ? (
								selectedMembers.map((member) => (
									<div className="flex items-center rounded border-muted-foreground mr-2">
										<Avatar className="w-6 h-6 mr-2">
											<AvatarImage
												src={member.image!}
												alt="User Avatar"
											/>
											<AvatarFallback className="flex p-2 h-full w-full items-center justify-center rounded-md bg-muted">
												{member.name[0]}
											</AvatarFallback>
										</Avatar>
										{member.name}
										<button
											onClick={(event) => {
												event.stopPropagation();
												const newSelectedMember = selectedMembers.filter(
													(selecteMember) => selecteMember.id !== member.id
												);
												setSelectedMembers(newSelectedMember);
												onMembersChange(newSelectedMember);
											}}
											className="ml-2 text-muted-foreground hover:text-muted-foreground/80"
											aria-label="Remove member">
											<X size={16} />
										</button>
									</div>
								))
							) : (
								<span className="text-muted-foreground">
									{title ?? "Select members"}
								</span>
							)}
						</div>
						<ChevronDown
							size={16}
							strokeWidth={2}
							className="shrink-0 ml-auto text-muted-foreground/80"
							aria-hidden="true"
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-full min-w-[var(--radix-popper-anchor-width)] p-0"
					align="start">
					{query.isLoading ? (
						<Command>Loading...</Command>
					) : (
						<Command>
							<CommandList>
								<CommandEmpty>No members found.</CommandEmpty>
								<CommandGroup>
									{query.data
										?.filter((item) => item?.id !== session?.user?.id)
										.map((item) => (
											<CommandItem
												key={item?.id}
												value={item?.id}
												onSelect={(currentValue) => {
													const isSelected = selectedMembers.some(
														(member) => member.id === item?.id
													);
													const newSelectedMember = isSelected
														? selectedMembers.filter(
																(member) => member.id !== item?.id
															)
														: [...selectedMembers, item];
													if (newSelectedMember === null) return;
													setSelectedMembers(newSelectedMember as User[]);
													onMembersChange(newSelectedMember as User[]);
												}}>
												<Avatar className="w-6 h-6 mr-2">
													<AvatarImage
														src={item?.image!}
														alt="User Avatar"
													/>
													<AvatarFallback className="flex p-2 h-full w-full items-center justify-center rounded-md bg-muted">
														{item?.name[0]}
													</AvatarFallback>
												</Avatar>
												{item?.name}
												<Check
													className={cn(
														"ml-auto",
														selectedMembers.some(
															(member) => member.id === item?.id
														)
															? "opacity-100"
															: "opacity-0"
													)}
												/>
											</CommandItem>
										))}
								</CommandGroup>
							</CommandList>
						</Command>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
}
