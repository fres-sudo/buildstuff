export default async function TaskPage({
	params,
}: {
	params: Promise<{ taskId: string }>;
}) {
	const { taskId } = await params;
	return <div>TaskPage: {taskId}</div>;
}
