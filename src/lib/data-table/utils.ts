import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Todo } from "../db/schema.types";
import {
	CheckCircle2,
	CircleHelp,
	CircleIcon,
	CircleX,
	Timer,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(
	date: Date | string | number,
	opts: Intl.DateTimeFormatOptions = {}
) {
	return new Intl.DateTimeFormat("en-US", {
		month: opts.month ?? "long",
		day: opts.day ?? "numeric",
		year: opts.year ?? "numeric",
		...opts,
	}).format(new Date(date));
}

export function toSentenceCase(str: string) {
	return str
		.replace(/_/g, " ")
		.replace(/([A-Z])/g, " $1")
		.toLowerCase()
		.replace(/^\w/, (c) => c.toUpperCase())
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
	originalEventHandler?: (event: E) => void,
	ourEventHandler?: (event: E) => void,
	{ checkForDefaultPrevented = true } = {}
) {
	return function handleEvent(event: E) {
		originalEventHandler?.(event);

		if (
			checkForDefaultPrevented === false ||
			!(event as unknown as Event).defaultPrevented
		) {
			return ourEventHandler?.(event);
		}
	};
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Todo["status"]) {
	const statusIcons = {
		canceled: CircleX,
		done: CheckCircle2,
		"in-progress": Timer,
		todo: CircleHelp,
	};

	return statusIcons[status] || CircleIcon;
}
