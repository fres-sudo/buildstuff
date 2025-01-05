"use client";

import { useWorkspace } from "@/hooks/use-workspace";

export const PageTitle = () => {
	const { currentWorkspace } = useWorkspace();
	return (
		<h2 className="text-2xl font-bold tracking-tight">
			<span className="font-normal">Analytics for:</span>{" "}
			{currentWorkspace?.name} 📊
			<p className="text-sm text-muted-foreground font-thin">
				Get comprehensive insights into your workspace performance with
				real-time analytics, project progress tracking, and team productivity
				metrics at a glance.
			</p>
		</h2>
	);
};
