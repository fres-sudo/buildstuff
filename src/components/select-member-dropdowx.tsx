import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import MultipleSelector from "./ui/multiselect";

const Square = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => (
	<span
		data-square
		className={cn(
			"flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground",
			className
		)}
		aria-hidden="true">
		{children}
	</span>
);

export default function SelectMemberDropdown({
	onMembersChange,
}: {
	onMembersChange: (members: string[]) => void;
}) {
	const { currentWorkspace } = useWorkspace();
	const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
	if (!currentWorkspace) return null;

	const query = api.workspaces.getMembers.useQuery({
		workspaceId: currentWorkspace.id,
	});

	const handleSelectChange = (value: string) => {
		let updatedMembers;
		if (selectedMembers.includes(value)) {
			updatedMembers = selectedMembers.filter((member) => member !== value);
		} else {
			updatedMembers = [...selectedMembers, value];
		}
		setSelectedMembers(updatedMembers);
		onMembersChange(updatedMembers);
	};

	return (
		<div className="space-y-2">
			<Select
				multiple
				onValueChange={handleSelectChange}>
				<SelectTrigger
					id="select-39"
					className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0">
					<SelectValue placeholder="Select members" />
				</SelectTrigger>
				<Label>Multiselect</Label>
				<MultipleSelector
					commandProps={{
						label: "Select frameworks",
					}}
					value={frameworks.slice(0, 2)}
					defaultOptions={frameworks}
					placeholder="Select frameworks"
					hideClearAllButton
					hidePlaceholderWhenSelected
					emptyIndicator={
						<p className="text-center text-sm">No results found</p>
					}
				/>
				<SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
					{query.isLoading && (
						<SelectItem value={"1"}>
							<Skeleton className="w-full h-4" />
						</SelectItem>
					)}
					{query.error && <p>Error: {query.error.message}</p>}
					{query.data?.map((member, index) => (
						<SelectItem
							key={index}
							value={index.toString()}>
							<Square className="bg-indigo-400/20 text-indigo-500">
								{member?.user?.name[0]}
							</Square>
							<span className="truncate">
								{member?.user?.name ?? "Lorem ipsum"}
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
