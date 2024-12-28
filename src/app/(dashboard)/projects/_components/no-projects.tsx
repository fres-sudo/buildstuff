"use client";
import { PlusCircle, FolderPlus, TableOfContentsIcon } from "lucide-react";
import CreateProjectDialog from "./create-project-dialog";
import { NewProject } from "@/lib/db/schema.types";
import { EmptyState } from "@/components/empty-state";

export default function NoProjects() {
	return (
		<EmptyState
			className="w-full my-4"
			title="No projects yet"
			description="Start by creating a new project."
			icons={[FolderPlus, PlusCircle, TableOfContentsIcon]}>
			<CreateProjectDialog
				onProjectCreated={function (project: NewProject): void {}}
				children={
					<>
						<PlusCircle className="h-4 w-4" />
						Create New Project
					</>
				}
				buttonVariant={"outline"}
				buttonClassname="flex"
			/>
		</EmptyState>
	);
}
