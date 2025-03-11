"use client";
import PageContainer from "@/components/layout/page-container";
import TaskOverview from "@/components/task/task-overview";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { Separator } from "@/components/ui/separator";
import { addDays, previousDay } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import AssignedTasks from "./_components/assigned-tasks";
import ProjectOverview from "./_components/projects-overview";
import { BarGraph } from "./_components/bar-chart";
import { AreaGraph } from "./_components/area-graph";

export default function Page() {
	const [date, setDate] = useState<DateRange | undefined>({
		from: addDays(new Date(), -30),
		to: new Date(),
	});
	return (
		<PageContainer>
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col md:flex-row items-start justify-between space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">
						Hi, Welcome back 👋
						<p className="text-sm text-muted-foreground font-thin">
							Here's what you've been up to today
						</p>
					</h2>
					<div className="items-center space-x-2 ">
						<CalendarDateRangePicker
							date={date}
							setDate={setDate}
						/>
					</div>
				</div>
				<TaskOverview />
				<div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:space-x-4">
					<BarGraph />
					<AreaGraph />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:space-x-4">
					<AssignedTasks />
					<ProjectOverview />
				</div>
			</div>
		</PageContainer>
	);
}
