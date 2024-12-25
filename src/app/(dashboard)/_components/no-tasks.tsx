import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList } from "lucide-react";

export default function NoTasks() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
			<div className="mb-4">
				<ClipboardList className="h-16 w-16 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-semibold mb-2">No tasks yet</h2>
			<p className="text-muted-foreground mb-4 max-w-sm">
				Start adding tasks to your project. Break down your work into manageable
				pieces and track your progress.
			</p>
			<Button>
				<PlusCircle className="mr-2 h-4 w-4" />
				Add New Task
			</Button>
		</div>
	);
}
