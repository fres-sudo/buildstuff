import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
