"use client";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectsList from "./_components/projects-list";
import NoProjects from "./_components/no-projects";
import PageContainer from "@/components/layout/page-container";
import { PageTitle } from "../_components/page-title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";

export default function ProjectsPage() {
	const { currentWorkspace } = useWorkspace();

	const query = api.projects.list.useQuery({
		workspaceId: currentWorkspace?.id || "",
	});

	if (query.error) {
		toast.error("Failed to fetch projects");
	}

	return (
		<PageContainer>
			<PageTitle
				title="Projects 💻"
				description="Those are all the projects in this workspace."
			/>
			{query.isLoading || !currentWorkspace ? (
				<Loading />
			) : !query.data?.length ? (
				<NoProjects />
			) : (
				<ProjectsList projects={query.data} />
			)}
		</PageContainer>
	);
}

const Loading = () => {
	return (
		<div className="space-y-4 mt-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, index) => (
					<Card
						key={index}
						className="w-full">
						<CardHeader className="pb-2">
							<Skeleton className="h-6 w-1/2" />
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-1/4" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
