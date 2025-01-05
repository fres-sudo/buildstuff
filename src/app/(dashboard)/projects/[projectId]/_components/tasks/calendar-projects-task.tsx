"use client";
import Calendar from "@/components/calendar/calendar";
import { CalendarEvent, Mode } from "@/components/calendar/calendar-types";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { TasksProps } from "./projects-tasks";

const CalendarProjectsTask = ({ tasks }: { tasks: TasksProps }) => {
	const { projectId } = useParams<{ projectId: string }>();

	const [mode, setMode] = useState<Mode>("month");
	const [date, setDate] = useState<Date>(new Date());

	const { data } = api.tasks.listCalendar.useQuery({
		projectId: projectId,
		mode: mode,
		from: date,
		to: date,
	});
	const [events, setEvents] = useState<CalendarEvent[]>(data || []);

	return (
		<Calendar
			events={events}
			setEvents={setEvents}
			mode={mode}
			setMode={setMode}
			date={date}
			setDate={setDate}
		/>
	);
};

export default CalendarProjectsTask;
