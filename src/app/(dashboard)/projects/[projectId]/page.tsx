import PageContainer from "@/components/layout/page-container";
import { api } from "@/trpc/server";

const ProjectPage = async ({
	params,
}: {
	params: {
		projectId: string;
	};
}) => {
	const { projectId } = params;
	const project = await api.projects.get({
		projectId,
	});
	if (!project) {
		return <div>Project not found</div>;
	}
	return (
		<PageContainer>
			<h2 className="text-2xl font-bold tracking-tight">
				{project.name.charAt(0).toUpperCase() + project.name.slice(1)}
				<p className="text-sm text-muted-foreground font-thin">
					{project.code}
				</p>
			</h2>
		</PageContainer>
	);
};

export default ProjectPage;
