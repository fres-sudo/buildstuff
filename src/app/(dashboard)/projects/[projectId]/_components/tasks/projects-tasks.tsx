"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableProjectsTask from "./table-projects-tasks";
import KanbanProjectsTask from "./kanban-project-tasks";
import CalendarProjectsTask from "./calendar-projects-task";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { useState } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { CreateTaskSheet } from "./create-task-sheet";
import { RouterOutputs } from "@/trpc/react";

export type TasksProps = NonNullable<
	Awaited<RouterOutputs["projects"]["get"]>
>["tasks"];

const ProjectTasks = ({ tasks }: { tasks: TasksProps }) => {
	const [date, setDate] = useState<DateRange | undefined>({
		from: addDays(new Date(), -30),
		to: new Date(),
	});
	return (
		<>
			<Tabs defaultValue="table">
				<div className="flex justify-between w-full">
					<TabsList className="grid grid-cols-3 w-56">
						<TabsTrigger value="table">Table</TabsTrigger>
						<TabsTrigger value="kanban">Kanban</TabsTrigger>
						<TabsTrigger value="calendar">Calendar</TabsTrigger>
					</TabsList>
					<div className="flex gap-x-2">
						<CalendarDateRangePicker
							date={date}
							setDate={setDate}
						/>
						<CreateTaskSheet />
					</div>
				</div>

				<TabsContent value="table">
					<TableProjectsTask tasks={tasks} />
				</TabsContent>
				<TabsContent value="kanban">
					<KanbanProjectsTask />
				</TabsContent>
				<TabsContent value="calendar">
					<CalendarProjectsTask tasks={tasks} />
				</TabsContent>
			</Tabs>
		</>
	);
};

export default ProjectTasks;
