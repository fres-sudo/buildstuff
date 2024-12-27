"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function TimeEntriesTable() {
	const [page, setPage] = useState(1);
	const { data: timeEntries, isLoading } = api.timeEntries.list.useQuery({
		page,
		limit: 10,
	});
	const deleteTimeEntry = api.timeEntries.delete.useMutation();

	if (isLoading) return <div>Loading time entries...</div>;

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Task</TableHead>
						<TableHead>Duration</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{timeEntries?.map((entry) => (
						<TableRow key={entry.id}>
							<TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
							<TableCell>{entry.taskId}</TableCell>
							<TableCell>{entry.duration} minutes</TableCell>
							<TableCell>{entry.description}</TableCell>
							<TableCell>
								<Button
									variant="ghost"
									size="icon"
									className="mr-2">
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => deleteTimeEntry.mutate({ id: entry.id })}>
									<Trash2 className="h-4 w-4" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex justify-between mt-4">
				<Button
					onClick={() => setPage((p) => Math.max(1, p - 1))}
					disabled={page === 1}>
					Previous
				</Button>
				<Button
					onClick={() => setPage((p) => p + 1)}
					disabled={!timeEntries || timeEntries.length < 10}>
					Next
				</Button>
			</div>
		</div>
	);
}
