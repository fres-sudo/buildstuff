import { Suspense } from "react";
import { TimeSheetCalendar } from "./_components/time-sheet-calendar";
import { TimeEntryForm } from "./_components/time-entries-form";
import { TimeEntriesTable } from "./_components/time-entries-table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { TimeChart } from "./_components/time-charts";

export default function TimeSheetPage() {
	return (
		<PageContainer>
			<div className="flex flex-col space-y-4">
				<TimeChart />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
					<Card className="md:col-span-2">
						<CardHeader>
							<CardTitle>Time Entries</CardTitle>
							<CardDescription>
								View and manage your time entries
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Suspense fallback={<div>Loading time entries...</div>}>
								<TimeEntriesTable />
							</Suspense>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Add Time Entry</CardTitle>
							<CardDescription>Record your work time</CardDescription>
						</CardHeader>
						<CardContent>
							<TimeEntryForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</PageContainer>
	);
}
