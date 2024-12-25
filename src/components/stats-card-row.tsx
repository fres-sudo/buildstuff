import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type StatsCardProps = {
	title: string;
	icon: LucideIcon;
	content: string;
	label: string;
};

type StatsCardOverviewProps = StatsCardProps[];

const StatsCard = ({ props }: { props: StatsCardProps }) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{props.title}</CardTitle>
				<props.icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{props.content}</div>
				<p className="text-xs text-muted-foreground">{props.label}</p>
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
