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
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function TaskPriorityDistribution({
	data,
}: {
	data: {
		name: "low" | "medium" | "high" | "urgent";
		value: unknown;
	}[];
}) {
	if (!data) return <div>Loading...</div>;

	const COLORS = ["#FF8042", "#FFBB28", "#00C49F"];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Task Priority Distribution</CardTitle>
				<CardDescription>Distribution of tasks by priority</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						high: { label: "High", color: COLORS[0] },
						medium: { label: "Medium", color: COLORS[1] },
						low: { label: "Low", color: COLORS[2] },
					}}
					className="h-[300px]">
					<ResponsiveContainer
						width="100%"
						height="100%">
						<PieChart>
							<Pie
								data={data}
								cx="50%"
								cy="50%"
								labelLine={false}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value">
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
