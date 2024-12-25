import { useWorkspace } from "@/hooks/use-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectsList from "./_components/projects-list";
import NoProjects from "./_components/no-projects";
import { api } from "@/trpc/server";

export default async function ProjectsPage() {
	const currentWorkspace = await api.workspaces.getCurrent();

	const projects = await api.projects.list({
		workspaceId: currentWorkspace.id,
	});

	if (!projects || !currentWorkspace) {
		return (
			<div>
				<h1>Projects</h1>
				<ul>
					{Array.from({ length: 5 }).map((_, index) => (
						<li
							key={index}
							className="flex items-center justify-between">
							<Skeleton className="w-100 h-20" />
						</li>
					))}
				</ul>
			</div>
		);
	}

	if (!projects?.length) {
		return <NoProjects />;
	}

	return <ProjectsList projects={projects} />;
}
