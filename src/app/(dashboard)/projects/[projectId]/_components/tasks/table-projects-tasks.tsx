import { TasksProps } from "./projects-tasks";
import { TaskTable } from "./table/TaskTable";
import { columns } from "./table/TaskTableColumns";

export default function TasksPage({ tasks }: { tasks: TasksProps }) {
	return (
		<div className="mx-auto py-10">
			<TaskTable
				data={tasks}
				columns={columns}
			/>
		</div>
	);
}
