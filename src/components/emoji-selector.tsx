"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
	asChild?: boolean;
	className?: string;
	children: React.ReactNode;
	onSelectedEmoji: (emoji: string) => void;
	slide?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
	id?: string;
	onOpenChange?: (open: boolean) => void;
}

interface OnSelect {
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	unified: string;
}

export const EmojiSelector = ({
	asChild,
	className,
	children,
	onSelectedEmoji,
	slide,
	align,
	id,
}: Props) => {
	const { theme, setTheme, systemTheme } = useTheme();
	const [open, setOpen] = useState(false);

	const emojiTheme = useMemo(() => {
		switch (theme) {
			case "dark":
				return "dark";
			case "light":
				return "light";
			case "system":
				return systemTheme;
		}
	}, [theme, systemTheme]);

	return (
		<DropdownMenu
			modal={false}
			open={open}
			onOpenChange={setOpen}>
			<DropdownMenuTrigger
				id={id}
				asChild={asChild}
				className={cn(
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-lg"
				)}>
				{children}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				asChild
				align={align}>
				<div className="z-50 emoji-picker">
					<Picker
						data={data}
						emojiSize={20}
						emojiButtonSize={32}
						theme={emojiTheme}
						onEmojiSelect={(e: OnSelect) => {
							onSelectedEmoji(e.unified);
							setOpen(false);
						}}
					/>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
