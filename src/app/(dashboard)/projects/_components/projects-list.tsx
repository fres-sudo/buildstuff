import React from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pin, Users, Clock, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Project, Task } from "@/lib/db/schema.types";

const ProjectsList = ({ projects }: { projects: any[] }) => {
	const getTaskProgress = (tasks: Task[]) => {
		if (!tasks || !tasks.length) return 0;
		const completed = tasks.filter(
			(task) => task.statusId === "completed"
		).length;
		return Math.round((completed / tasks.length) * 100);
	};

	const sortedProjects = projects.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	return (
		<div className="space-y-4 mt-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{sortedProjects.map((project) => {
					const progress = getTaskProgress(project.tasks);

					return (
						<Card
							key={project.id}
							className="group relative w-full">
							<CardHeader className="pb-2">
								<div className="flex justify-between items-start">
									<div>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="text-xs">
												{project.code}
											</Badge>
											{project.archived && (
												<Badge
													variant="secondary"
													className="text-xs">
													Archived
												</Badge>
											)}
											{project.pinned && (
												<Pin className="h-4 w-4 text-yellow-500" />
											)}
										</div>
										<CardTitle className="mt-2">
											<a
												className="hover:underline"
												href={`/projects/${project.id}`}>
												{project.name}
											</a>
										</CardTitle>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>Edit Project</DropdownMenuItem>
											<DropdownMenuItem>Manage Members</DropdownMenuItem>
											<DropdownMenuItem>
												{project.archived ? "Unarchive" : "Archive"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>

							<CardContent>
								<div className="space-y-4">
									{/* Labels */}
									{project.labels && project.labels.length > 0 ? (
										<div className="flex flex-wrap gap-1">
											{project.labels.map((projectLabel: any) => (
												<Badge
													key={projectLabel.id}
													variant="secondary"
													className="text-xs">
													{projectLabel.label.name}
												</Badge>
											))}
										</div>
									) : (
										<br />
									)}

									{/* Stats */}
									<div className="grid grid-cols-2 gap-4 text-sm">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-muted-foreground" />
											<span>{project.members?.length ?? 0} members</span>
										</div>
										<div className="flex items-center gap-2">
											<CheckSquare className="h-4 w-4 text-muted-foreground" />
											<span>{project.tasks?.length ?? 0} tasks</span>
										</div>
									</div>

									{/* Progress */}
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Progress</span>
											<span className="font-medium">{progress}%</span>
										</div>
										<Progress
											value={progress}
											className="h-2"
										/>
									</div>

									{/* Timestamps */}
									<div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											<span>
												Created{" "}
												{format(new Date(project.createdAt), "MMM d, yyyy")}
											</span>
										</div>
										{project.updatedAt && (
											<span>
												Updated{" "}
												{format(new Date(project.updatedAt), "MMM d, yyyy")}
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default ProjectsList;
