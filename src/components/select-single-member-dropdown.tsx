import { Label } from "@/components/ui/label";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { User } from "@/lib/db/schema.types";
import { Check, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "@/lib/api/auth/auth-client";

export default function SelectSingleMemberDropdown({
	onMemberChange,
	title,
}: {
	title?: string;
	onMemberChange: (member: User | null) => void;
}) {
	const { currentWorkspace } = useWorkspace();
	const { data: session } = useSession();
	const [selectedMember, setSelectedMember] = useState<User | null>(null);

	if (!currentWorkspace) return null;

	const query = api.workspaces.getMembers.useQuery({
		workspaceId: currentWorkspace.id,
	});

	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="space-y-2">
			<Label htmlFor="select-42">{title ?? "Select Member"}</Label>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-start bg-background px-3 font-normal hover:bg-background">
						{selectedMember ? (
							<div className="flex items-center">
								<Avatar className="w-6 h-6 mr-2">
									<AvatarImage
										src={selectedMember.image!}
										alt="User Avatar"
									/>
									<AvatarFallback className="flex p-2 h-full w-full items-center justify-center rounded-md bg-muted">
										{selectedMember.name[0]}
									</AvatarFallback>
								</Avatar>
								{selectedMember.name}
							</div>
						) : (
							<span className="text-muted-foreground">
								{title ?? "Select a member"}
							</span>
						)}
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
												onSelect={() => {
													const isSelected = selectedMember?.id === item?.id;
													const newSelectedMember = isSelected ? null : item;
													setSelectedMember(newSelectedMember);
													onMemberChange(newSelectedMember);
													setOpen(false); // Close dropdown after selection
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
														selectedMember?.id === item?.id
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
