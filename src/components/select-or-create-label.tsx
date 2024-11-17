import { Label } from "@/components/ui/label";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useSession } from "@/lib/api/auth/auth-client";
import { toast } from "sonner";
import { Input } from "./ui/input";
import ColorRadio from "./ui/color-radio";
import type { Label as LabelType } from "@/lib/db/schema.types";
import { useWorkspace } from "@/hooks/use-workspace";

interface SelectOrCreateLabelProps {
	onLabelSelect: (labels: LabelType[]) => void;
}

export default function SelectOrCreateLabel({
	onLabelSelect,
}: SelectOrCreateLabelProps) {
	const labels = api.labels.list.useQuery();
	const createLabelsMutation = api.labels.create.useMutation();
	const { currentWorkspace } = useWorkspace();

	const [open, setOpen] = useState<boolean>(false);
	const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([]);
	const [name, setName] = useState<string>("");
	const [color, setColor] = useState<string>("blue");

	async function handleCreateLabel() {
		if (!name) return;
		const newLabel = await createLabelsMutation.mutateAsync({
			name,
			color,
			workspaceId: currentWorkspace?.id,
		});
		if (newLabel) {
			labels.refetch();
		} else {
			toast.error("Failed to create label");
		}
		setName("");
		setColor("");
	}

	useEffect(() => {
		if (open && !labels.data) {
			labels.refetch();
		}
	}, [open, labels]);

	if (labels.error) {
		toast.error(labels.error.message);
	}
	return (
		<div className="space-y-2">
			<Label htmlFor="select-42">Labels</Label>
			<Popover
				open={open}
				onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id="select-42"
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-start bg-background px-3 font-normal hover:bg-background">
						<div className="flex flex-wrap gap-1">
							{selectedLabels.length > 0 ? (
								selectedLabels.map((label) => (
									<div className="flex items-center rounded border-muted-foreground mr-2">
										<StatusDot
											key={label.id}
											className={`bg-${label.color}-500 mr-2`}
										/>
										{label.name}
										<button
											onClick={() => {
												const newSelectedLabels = selectedLabels.filter(
													(selectedLabel) => selectedLabel.id !== label.id
												);
												setSelectedLabels(newSelectedLabels);
												onLabelSelect(newSelectedLabels);
											}}
											className="ml-2 text-muted-foreground hover:text-muted-foreground/80"
											aria-label="Remove label">
											<X size={16} />
										</button>
									</div>
								))
							) : (
								<span className="text-muted-foreground">Select labels</span>
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
					{labels.isLoading ? (
						<Command>Loading...</Command>
					) : (
						<Command>
							<CommandInput placeholder={"Find Labels"} />
							<CommandList>
								<CommandEmpty>No labels found.</CommandEmpty>
								<CommandGroup>
									{labels.data?.map((item) => (
										<CommandItem
											key={item.id}
											value={item.id}
											onSelect={(currentValue) => {
												const isSelected = selectedLabels.some(
													(label) => label.id === item.id
												);
												const newSelectedLabels = isSelected
													? selectedLabels.filter(
															(label) => label.id !== item.id
														)
													: [...selectedLabels, item];
												setSelectedLabels(newSelectedLabels);
												onLabelSelect(newSelectedLabels);
											}}>
											<StatusDot className={`bg-${item.color}-500`} />
											{item.name}
											<Check
												className={cn(
													"ml-auto",
													selectedLabels.some((label) => label.id === item.id)
														? "opacity-100"
														: "opacity-0"
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
								<CommandSeparator />
								<CommandGroup className="my-2 space-y-2 mx-2">
									<Input
										value={name}
										className="mb-2"
										placeholder="Choose a label name"
										onChange={(e) => setName(e.target.value)}
									/>
									<ColorRadio onColorChange={(value) => setColor(value)} />
									<Button
										className="w-full mt-2"
										onClick={handleCreateLabel}
										variant={"secondary"}>
										<Plus className="mr-2 h-4 w-4" />
										Create Label
									</Button>
								</CommandGroup>
							</CommandList>
						</Command>
					)}
				</PopoverContent>
			</Popover>
		</div>
	);
}

function StatusDot({ className }: { className?: string }) {
	return <div className={`${className} w-2 h-2 rounded-full`}></div>;
}
