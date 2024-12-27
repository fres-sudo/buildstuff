"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

export async function TaskDistributionChart({
	data,
}: {
	data: {
		project: string;
		tasks: unknown;
	}[];
}) {
	if (!data) return <div>Loading...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Task Distribution</CardTitle>
				<CardDescription>Tasks across projects</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						tasks: { label: "Tasks", color: "hsl(var(--chart-1))" },
					}}
					className="h-[300px]">
					<ResponsiveContainer
						width="100%"
						height="100%">
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="project" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								dataKey="tasks"
								fill="var(--color-tasks)"
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
