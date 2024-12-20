import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Icons } from "./icons";
import { FormDescription } from "./ui/form";

interface MultipleEmailFormFieldProps {
	onChangeEmails: (emails: string[]) => void;
}

const MultipleEmailFormField: React.FC<MultipleEmailFormFieldProps> = ({
	onChangeEmails,
}) => {
	const [emails, setEmails] = useState<string[]>([""]);

	const handleEmailChange = (index: number, value: string) => {
		const newEmails = [...emails];
		newEmails[index] = value;
		setEmails(newEmails);
		onChangeEmails(newEmails);
	};
	const handleAddEmailField = () => {
		setEmails([...emails, ""]);
	};

	const handleRemoveEmailField = (index: number) => {
		const newEmails = emails.filter((_, i) => i !== index);
		setEmails(newEmails);
		onChangeEmails(newEmails);
	};

	return (
		<div className="items-end space-y-2">
			{emails.map((email, index) => (
				<div
					key={index}
					className="flex gap-2">
					<Input
						type="email"
						value={email}
						onChange={(e) => handleEmailChange(index, e.target.value)}
						placeholder="email@example.com"
						className="w-full"
					/>
					{emails.length > 1 && (
						<Button
							variant={"secondary"}
							className="w-10"
							type="button"
							onClick={() => handleRemoveEmailField(index)}>
							<Trash2 />
						</Button>
					)}
				</div>
			))}
			<FormDescription>
				Invite people to collaborate on this project by adding their email, at
				every email will be sent an invitation link, and they can access to your
				project. Please notice that you can invite people later and the people
				you invite wont be able to see all your workspace.{" "}
			</FormDescription>
			<Button
				variant={"outline"}
				className=""
				type="button"
				onClick={handleAddEmailField}>
				Add Email
				<Plus className="h-4 w-4" />
			</Button>
		</div>
	);
};

export default MultipleEmailFormField;
