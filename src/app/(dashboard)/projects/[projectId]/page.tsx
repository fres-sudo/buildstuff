const ProjectPage = ({
	params,
}: {
	params: {
		projectId: string;
	};
}) => {
	const { projectId } = params;

	return <div>Project ID: {projectId}</div>;
};

export default ProjectPage;
