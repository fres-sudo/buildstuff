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

export function ProjectCompletionChart({
	data,
}: {
	data: {
		name: unknown;
		value: unknown;
	}[];
}) {
	if (!data) return <div>Loading...</div>;

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Project Completion</CardTitle>
				<CardDescription>Overview of project statuses</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						completed: { label: "Completed", color: COLORS[0] },
						inProgress: { label: "In Progress", color: COLORS[1] },
						notStarted: { label: "Not Started", color: COLORS[2] },
						overdue: { label: "Overdue", color: COLORS[3] },
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
								{data.map((entry, index) => {
									return (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									);
								})}
							</Pie>
							<ChartTooltip content={<ChartTooltipContent />} />
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
