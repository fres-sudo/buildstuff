import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type StatsCardProps = {
	title: string;
	icon: LucideIcon;
	content: string;
	subContent: string;
	label: string;
	trend: boolean;
};

type StatsCardOverviewProps = StatsCardProps[];

const StatsCard = ({ props }: { props: StatsCardProps }) => {
	const isZero = props.subContent === "0";
	return (
		<Card className="overflow-hidden border-muted transition-all duration-300 hover:scale-105 hover:shadow-lg">
			<CardContent className="p-4">
				<div className="flex items-center justify-between mb-2">
					<h3 className="text-sm font-medium text-gray-400">{props.title}</h3>
					<props.icon className="h-4 w-4 text-gray-400" />
				</div>
				<div className="text-2xl font-bold text-white mb-2">
					{props.content}
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs text-gray-400">{props.label}</span>
					<div
						className={cn(
							"flex items-center space-x-1 text-sm font-medium",
							isZero
								? "text-muted-foreground"
								: props.trend
									? "text-green-400"
									: "text-red-400"
						)}>
						<span>
							{isZero ? "" : props.trend ? "+" : "-"}
							{props.subContent}
						</span>
						<span className="text-xs">
							{isZero ? "-" : props.trend ? "↑" : "↓"}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const StatsCardOverview = ({ props }: { props: StatsCardOverviewProps }) => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{props.map((stat, index) => (
				<StatsCard
					key={index}
					props={stat}
				/>
			))}
		</div>
	);
};

const StatsCardSkeleton = () => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-4 w-4" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-8 w-24 mb-2" />
				<Skeleton className="h-4 w-16" />
			</CardContent>
		</Card>
	);
};

const StatsCardOverviewSkeleton = () => {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<StatsCardSkeleton key={index} />
			))}
		</div>
	);
};

export {
	StatsCard,
	StatsCardOverview,
	StatsCardSkeleton,
	StatsCardOverviewSkeleton,
	type StatsCardOverviewProps,
};
