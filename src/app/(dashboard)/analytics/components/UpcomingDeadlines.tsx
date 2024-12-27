"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/server";

export function UpcomingDeadlines({
	data,
}: {
	data: {
		id: string;
		name: string;
		project: string;
		dueDate: Date | null;
	}[];
}) {
	if (!data) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Upcoming Deadlines</CardTitle>
				<CardDescription>Tasks due in the next 7 days</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Task</TableHead>
							<TableHead>Project</TableHead>
							<TableHead>Due Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((task) => (
							<TableRow key={task.id}>
								<TableCell>{task.name}</TableCell>
								<TableCell>{task.project}</TableCell>
								<TableCell>
									{new Date(task.dueDate ?? new Date()).toLocaleDateString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
