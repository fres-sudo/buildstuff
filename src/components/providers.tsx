"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";
import { WorkspaceProvider } from "@/hooks/use-workspace";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider {...props}>
			<TooltipProvider>
				<NuqsAdapter>
					<TRPCReactProvider>
						<WorkspaceProvider>{children}</WorkspaceProvider>
					</TRPCReactProvider>
				</NuqsAdapter>
			</TooltipProvider>
		</NextThemesProvider>
	);
}
