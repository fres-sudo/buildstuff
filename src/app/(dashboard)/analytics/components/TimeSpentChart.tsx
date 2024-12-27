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
import { api } from "@/trpc/server";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";

export default function TimeSpentChart({
	data,
}: {
	data: {
		date: unknown;
		hours: unknown;
	}[];
}) {
	if (!data) return <div>Loading...</div>;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Time Spent on Tasks</CardTitle>
				<CardDescription>Hours spent on tasks over time</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						hours: { label: "Hours", color: "hsl(var(--chart-3))" },
					}}
					className="h-[300px]">
					<ResponsiveContainer
						width="100%"
						height="100%">
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="hours"
								stroke="var(--color-hours)"
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
