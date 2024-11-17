import { useWorkspace } from "@/hooks/use-workspace";
import { api } from "@/trpc/server";

export default async function ProjectsPage() {
	const { currentWorkspace } = useWorkspace();
	if (!currentWorkspace) return null;
	const projects = await api.projects.list({
		workspaceId: currentWorkspace?.id,
	});

	return (
		<div>
			<h1>Projects</h1>
			<ul>
				{projects?.map((project) => <li key={project.id}>{project.name}</li>)}
			</ul>
		</div>
	);
}
