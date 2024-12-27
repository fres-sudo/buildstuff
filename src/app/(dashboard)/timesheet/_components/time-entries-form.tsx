"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { SearchProjects } from "@/components/search-projects";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateTimePicker } from "@/components/calendar/form/date-time-picker";
import { DatePickerWithPresets } from "@/components/ui/date-picker-presets";
import DatePicker from "@/components/ui/date-picker";

const formSchema = z.object({
	projectId: z.string().min(1, "Project is required"),
	taskId: z.string().min(1, "Task is required"),
	date: z.date(),
	startTime: z.date(),
	endTime: z.date(),
	description: z.string().optional(),
});

export function TimeEntryForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [time, setTime] = useState<string>("05:00");
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectId: "",
			taskId: "",
			date: new Date(),
			startTime: new Date(),
			endTime: new Date(),
			description: "",
		},
	});

	const createTimeEntry = api.timeEntries.create.useMutation();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const data = {
				taskId: values.taskId,
				date: values.date,
				duration: Math.abs(
					values.endTime.getTime() - values.startTime.getTime()
				),
				description: values.description,
			};
			await createTimeEntry.mutateAsync(data);
			toast.success("Time entry created successfully");
			form.reset();
		} catch (error) {
			toast.error("Failed to create time entry");
			console.error("Failed to create time entry:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-2s">
				<FormField
					control={form.control}
					name="projectId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel className="mb-1">Project</FormLabel>
							<FormControl>
								<SearchProjects
									onProjectSelect={(projectId) => field.onChange(projectId)}
								/>
							</FormControl>
							<FormMessage />
							<FormDescription>
								You can only select tasks from the project within the current
								workspace.
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="taskId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Task</FormLabel>
							<FormControl>
								<Input
									placeholder="Task"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DatePicker
					form={form}
					name={"Date"}
					label={"Date"}
				/>
				<div className="flex space-x-4">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Start Time</FormLabel>
								<FormControl>
									<Select
										defaultValue={time!}
										onValueChange={(e) => {
											setTime(e);
											if (form.getValues("date")) {
												const [hours, minutes] = e.split(":");
												const newDate = new Date(
													form.getValues("date").getTime()
												);
												newDate.setHours(parseInt(hours!), parseInt(minutes!));
												field.onChange(newDate);
											}
										}}>
										<SelectTrigger className="font-normal focus:ring-0 w-[120px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[15rem]">
												{Array.from({ length: 96 }).map((_, i) => {
													const hour = Math.floor(i / 4)
														.toString()
														.padStart(2, "0");
													const minute = ((i % 4) * 15)
														.toString()
														.padStart(2, "0");
													return (
														<SelectItem
															key={i}
															value={`${hour}:${minute}`}>
															{hour}:{minute}
														</SelectItem>
													);
												})}
											</ScrollArea>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
								<FormDescription>
									Select the start time for the task
								</FormDescription>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>End Time</FormLabel>
								<FormControl>
									<Select
										defaultValue={time!}
										onValueChange={(e) => {
											setTime(e);
											if (form.getValues("date")) {
												const [hours, minutes] = e.split(":");
												const newDate = new Date(
													form.getValues("date").getTime()
												);
												newDate.setHours(parseInt(hours!), parseInt(minutes!));
												field.onChange(newDate);
											}
										}}>
										<SelectTrigger className="font-normal focus:ring-0 w-[120px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[15rem]">
												{Array.from({ length: 96 }).map((_, i) => {
													const hour = Math.floor(i / 4)
														.toString()
														.padStart(2, "0");
													const minute = ((i % 4) * 15)
														.toString()
														.padStart(2, "0");
													return (
														<SelectItem
															key={i}
															value={`${hour}:${minute}`}>
															{hour}:{minute}
														</SelectItem>
													);
												})}
											</ScrollArea>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
								<FormDescription>
									Select the end time for the task
								</FormDescription>
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe your work..."
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Optional: Provide details about the work done
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Add Time Entry"}
				</Button>
			</form>
		</Form>
	);
}
