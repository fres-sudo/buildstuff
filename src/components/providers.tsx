"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider {...props}>
			<TooltipProvider>
				<NuqsAdapter>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</NuqsAdapter>
			</TooltipProvider>
		</NextThemesProvider>
	);
}
