import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

const AddTaskButton = () => {
	return (
		<Button onClick={() => console.log("cliecked")}>
			<Icons.add className="h-4 w-4 " />
			Add Task
		</Button>
	);
};

export default AddTaskButton;
