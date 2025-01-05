"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

import { toast } from "@/hooks/use-toast";
import { NewTask, NewTodo } from "@/lib/db/schema.types";
import { newTaskSchema, newTodoSchema } from "@/lib/db/zod.schema";
import { Icons } from "@/components/icons";
import { api } from "@/trpc/react";
import type { Label as LabelType } from "@/lib/db/schema.types";
import { Textarea } from "@/components/ui/textarea";
import SelectMultipleMembersDropdown from "@/components/select-multiple-members-dropdowx";
import SelectOrCreateLabel from "@/components/select-or-create-label";
import SelectSingleMemberDropdown from "@/components/select-single-member-dropdown";
import LoadingIcon from "@/components/loading-icon";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface UpdateTaskSheetProps
	extends React.ComponentPropsWithRef<typeof Sheet> {}

export function CreateTaskSheet({ ...props }: UpdateTaskSheetProps) {
	const createTaskMutation = api.tasks.create.useMutation();

	const form = useForm<NewTask>({
		resolver: zodResolver(newTaskSchema),
	});

	const [assignee, setAssignee] = React.useState<string | null>();
	const [reviewer, setReviewer] = React.useState<string>();
	const [labels, setLabels] = React.useState<LabelType[]>([]);
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: addDays(new Date(), -30),
		to: new Date(),
	});

	const [isUpdatePending, startUpdateTransition] = React.useTransition();

	async function onSubmit(input: NewTask) {
		startUpdateTransition(async () => {
			const newTodo = await createTaskMutation.mutateAsync({
				assigneeId: assignee,
				reviewerId: reviewer,
				...input,
			});
			form.reset();
			props.onOpenChange?.(false);
			if (newTodo) {
				toast({
					title: "Task Created",
					description: "The task has been created successfully.",
				});
			} else {
				toast({
					title: "Error",
					description: "An error occurred while creating the task.",
				});
			}
		});
	}

	return (
		<Sheet {...props}>
			<SheetTrigger asChild>
				<Button>
					<Icons.add className="w-4 h-4" />
					New Task
				</Button>
			</SheetTrigger>
			<SheetContent className="flex flex-col sm:max-w-md ">
				<SheetHeader className="text-left">
					<SheetTitle>Create Task 🎯</SheetTitle>
					<SheetDescription>
						Create a new Task and complete your project!
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Do a kickflip"
											className="resize-none"
											{...field}
											value={field.value ?? ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											value={
												field.value as
													| string
													| number
													| readonly string[]
													| undefined
											}
											placeholder="Tell us a little bit about yourself"
											className="resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormLabel>From - To</FormLabel>
						<CalendarDateRangePicker
							date={date}
							setDate={setDate}
						/>
						<SelectOrCreateLabel
							onLabelSelect={(labels) => setLabels(labels)}
						/>
						<SelectSingleMemberDropdown
							title="Assignee"
							onMemberChange={(member) => setAssignee(member?.id)}
						/>
						<SelectSingleMemberDropdown
							title="Select Reviewer"
							onMemberChange={(member) => setReviewer(member?.id)}
						/>
						<SheetFooter className="gap-2 pt-2 sm:space-x-0">
							<SheetClose asChild>
								<Button
									type="button"
									variant="outline">
									Cancel
								</Button>
							</SheetClose>
							<Button disabled={isUpdatePending}>
								{isUpdatePending && <LoadingIcon />}
								Save
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
