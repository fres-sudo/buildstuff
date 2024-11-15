import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const takeFirst = <T>(values: T[]): T | null => {
	if (values.length === 0) return null;
	return values[0]!;
};

export const takeFirstOrThrow = <T>(values: T[]): T => {
	if (values.length === 0) throw new Error("Resource not found");
	return values[0]!;
};

export function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diffInDays = Math.ceil(
		(date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
	);

	if (diffInDays === 0) return "Today";
	if (diffInDays === 1) return "Tomorrow";
	if (diffInDays <= 7) return `In ${diffInDays} days`;
	if (diffInDays <= 14) return `In ${Math.ceil(diffInDays / 7)} week`;
	if (diffInDays <= 30) return `In ${Math.ceil(diffInDays / 7)} weeks`;
	if (diffInDays <= 60) return `In 1 month`;

	return format(date, "MMM d, yyyy");
}
