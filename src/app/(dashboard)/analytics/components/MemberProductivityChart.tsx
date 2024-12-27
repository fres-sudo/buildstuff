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

export function MemberProductivityChart({
	data,
}: {
	data: {
		member: string;
		completed: unknown;
	}[];
}) {
	if (!data) return <div>Loading...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Member Productivity</CardTitle>
				<CardDescription>Tasks completed by each member</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						completed: {
							label: "Completed Tasks",
							color: "hsl(var(--chart-2))",
						},
					}}
					className="h-[300px]">
					<ResponsiveContainer
						width="100%"
						height="100%">
						<BarChart
							data={data}
							layout="vertical">
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis type="number" />
							<YAxis
								dataKey="member"
								type="category"
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar
								dataKey="completed"
								fill="var(--color-completed)"
							/>
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
