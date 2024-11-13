import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { FilterAssignedTasks } from "./filter-assigned-tasks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import AddTaskButton from "./add-task-button";

type Task = {
	id: string;
	title: string;
	projectName: string;
	description: string;
	dueDate: Date;
};

const AssignedTasks = () => {
	const router = useRouter();

	const tasks: Task[] = [
		{
			id: "1",
			title: "Task 1",
			projectName: "Project 1",
			description: "Description of task 1",
			dueDate: new Date(),
		},
		{
			id: "2",
			title: "Task 2",
			projectName: "Project 2",
			description: "Description of task 2",
			dueDate: new Date(),
		},
		{
			id: "3",
			title: "Task 3",
			projectName: "Project 3",
			description: "Description of task 3",
			dueDate: new Date(),
		},
	];

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-lg md:text-xl">
					Assigned Tasks
					<p className="text-xs text-muted-foreground font-thin">
						Let's get ready for some work!
					</p>
				</CardTitle>
				<AddTaskButton />
			</CardHeader>
			<CardContent>
				{tasks.map((task) => (
					<a key={task.id}>
						<AssignedTaskElement task={task} />
					</a>
				))}
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() => router.push("/my-tasks")}
					variant={"secondary"}>
					View All
				</Button>
			</CardFooter>
		</Card>
	);
};

const AssignedTaskElement = ({ task }: { task: Task }) => {
	function formatDueDate(dueDate: Date): import("react").ReactNode {
		return dueDate.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}
	return (
		<div className="p-3 my-2 rounded-lg border hover:bg-muted">
			<div className="flex flex-col items-start justify-between ml-4">
				<div className="flex flex-row items-center space-x-2">
					<div className="text-md font-medium">{task.title}</div>
				</div>
				<div className="flex gap-2 text-sm text-muted-foreground">
					<p>{task.projectName}</p>
					<p>•</p>
					<p className="flex items-center">
						<Icons.calendar className="h-4 w-4 mr-2" />
						Due {formatDueDate(task.dueDate)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default AssignedTasks;
