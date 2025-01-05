import { Suspense } from "react";
import { ProjectCompletionChart } from "./components/ProjectCompletionChart";
import { MemberProductivityChart } from "./components/MemberProductivityChart";
import { UpcomingDeadlines } from "./components/UpcomingDeadlines";
import { TaskPriorityDistribution } from "./components/TaskPriorityDistribution";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/use-workspace";
import TimeSpentChart from "./components/TimeSpentChart";
import { api } from "@/trpc/server";
import { TaskDistributionChart } from "./components/TaskDistributionChart";
import PageContainer from "@/components/layout/page-container";
import { a } from "node_modules/better-auth/dist/auth-CfxMSdnJ";
import { PageTitle } from "./components/title";

export default async function AnalyticsPage() {
	const [
		projectCompletionData,
		memberProductivityData,
		upcomingDeadlinesData,
		taskPriorityData,
		taskDistributionData,
		timeSpentData,
	] = await Promise.all([
		api.analytics.getProjectCompletion(),
		api.analytics.getMemberProductivity(),
		api.analytics.getUpcomingDeadlines(),
		api.analytics.getTaskPriorityDistribution(),
		api.analytics.getTaskDistribution(),
		api.analytics.getTimeSpent(),
	]);

	return (
		<PageContainer>
			<div className="flex flex-col space-y-4">
				<Suspense fallback={<Skeleton className="h-8 w-[300px]" />}>
					<PageTitle />
				</Suspense>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Suspense fallback={<ChartSkeleton />}>
						<ProjectCompletionChart data={projectCompletionData} />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<MemberProductivityChart data={memberProductivityData} />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<TimeSpentChart data={timeSpentData} />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<UpcomingDeadlines data={upcomingDeadlinesData} />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<TaskPriorityDistribution data={taskPriorityData} />
					</Suspense>
					<Suspense fallback={<ChartSkeleton />}>
						<TaskDistributionChart data={taskDistributionData} />
					</Suspense>
				</div>
			</div>
		</PageContainer>
	);
}

function ChartSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-[300px] w-full" />
			</CardContent>
		</Card>
	);
}
