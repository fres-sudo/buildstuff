import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { Button } from "./button";
import { UseFormReturn } from "react-hook-form";

interface DatePickerProps {
	form: UseFormReturn<any>;
	name: string;
	label?: string;
	description?: string;
	fromDate?: Date;
	toDate?: Date;
}

export default function DatePicker({
	form,
	name,
	label,
	description,
	fromDate,
	toDate,
}: DatePickerProps) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex felx-col w-full items-start justify-start">
					{label && <FormLabel>{label}</FormLabel>}
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant={"outline"}
									className={cn(
										"w-full text-left font-normal",
										!field.value && "text-muted-foreground"
									)}>
									{field.value ? (
										format(field.value, "PPP")
									) : (
										<span>Pick a date</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto p-0"
							align="start">
							<Calendar
								fromDate={
									fromDate ??
									new Date(new Date().setFullYear(new Date().getFullYear() - 1))
								}
								toDate={
									toDate ??
									new Date(new Date().setFullYear(new Date().getFullYear() + 1))
								}
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								disabled={(date) =>
									date >
										new Date(
											new Date().setFullYear(new Date().getFullYear() + 1)
										) || date < new Date("1900-01-01")
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
					{description && <FormDescription>{description}</FormDescription>}
				</FormItem>
			)}
		/>
	);
}
