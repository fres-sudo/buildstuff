import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

interface SelectWithIconsProps {
	value: string;
	label: string;
	icon: LucideIcon;
}

export default function SelectWithIcons({
	placeholder,
	items,
	onValueChange,
	defaultValue,
}: {
	onValueChange: (...event: any[]) => void;
	defaultValue: "low" | "medium" | "high" | "urgent";
	placeholder: string;
	items: SelectWithIconsProps[];
}) {
	return (
		<Select
			onValueChange={onValueChange}
			defaultValue={defaultValue}>
			<SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80 text-muted-foreground">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
				{items.map((item, index) => (
					<SelectItem
						value={item.value}
						key={index}>
						<item.icon
							size={16}
							aria-hidden="true"
						/>
						<span className="truncate">{item.label}</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
