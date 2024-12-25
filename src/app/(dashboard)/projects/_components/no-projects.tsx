import { Button } from "@/components/ui/button";
import { PlusCircle, FolderPlus } from "lucide-react";
import CreateProjectDialog from "./create-project-dialog";
import { NewProject } from "@/lib/db/schema.types";

export default function NoProjects() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
			<div className="mb-4">
				<FolderPlus
					strokeWidth={1}
					className="h-16 w-16 text-muted-foreground"
				/>
			</div>
			<h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
			<p className="text-muted-foreground mb-4 max-w-sm">
				Create your first project to start organizing your tasks and
				collaborating with your team.
			</p>

			<CreateProjectDialog
				onProjectCreated={function (project: NewProject): void {
					throw new Error("Function not implemented.");
				}}
				children={
					<>
						<PlusCircle className="h-4 w-4" />
						Create New Project
					</>
				}
				buttonVariant={"default"}
				buttonClassname="flex"
			/>
		</div>
	);
}
