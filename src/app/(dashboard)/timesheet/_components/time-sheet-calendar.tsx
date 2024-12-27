"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { api } from "@/trpc/react";

export function TimeSheetCalendar() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const { data: timeEntries } = api.timeEntries.getByDate.useQuery(
		{ date: date?.toISOString() ?? "" },
		{ enabled: !!date }
	);

	return (
		<div>
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-md border"
				components={{
					Day: (props) => (
						<div className="relative">
							{props.day.date.toDateString() === date?.toDateString() && (
								<div className="absolute inset-0 bg-primary/50 rounded-full" />
							)}
							<div className="relative z-10">
								{props.day.date.getDate()}
								{timeEntries?.some(
									(entry) =>
										new Date(entry.date).toDateString() ===
										props.day.date.toDateString()
								) && (
									<div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1" />
								)}
							</div>
						</div>
					),
				}}
			/>
		</div>
	);
}
