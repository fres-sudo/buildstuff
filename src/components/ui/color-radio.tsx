import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ColorRadioProps {
	defaultValue?: string;
	value?: string;
	onColorChange?: (color: string) => void;
}

const colorHexMap: { [key: string]: string } = {
	blue: "#0000FF",
	indigo: "#4B0082",
	pink: "#FFC0CB",
	red: "#FF0000",
	orange: "#FFA500",
	yellow: "#FFFF00",
	green: "#008000",
};

export default function gColorRadio({
	defaultValue = "blue",
	value,
	onColorChange,
}: ColorRadioProps) {
	const [selectedColor, setSelectedColor] = useState(value || defaultValue);

	useEffect(() => {
		if (value) {
			setSelectedColor(value);
		}
	}, [value]);

	const handleColorChange = (value: string) => {
		setSelectedColor(value);
		console.log("value", value);
		if (onColorChange) {
			onColorChange(value);
		}
	};

	return (
		<fieldset className="space-y-4">
			<legend className="text-sm font-medium leading-none text-foreground">
				Choose a color
			</legend>
			<RadioGroup
				className="flex gap-1.5"
				value={selectedColor}
				onValueChange={handleColorChange}>
				<RadioGroupItem
					value="blue"
					id="radio-07-blue"
					aria-label="Blue"
					className="size-6 border-blue-500 bg-blue-500 shadow-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
				/>
				<RadioGroupItem
					value="indigo"
					id="radio-07-indigo"
					aria-label="Indigo"
					className="size-6 border-indigo-500 bg-indigo-500 shadow-none data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
				/>
				<RadioGroupItem
					value="pink"
					id="radio-07-pink"
					aria-label="Pink"
					className="size-6 border-pink-500 bg-pink-500 shadow-none data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
				/>
				<RadioGroupItem
					value="red"
					id="radio-07-red"
					aria-label="red"
					className="size-6 border-red-500 bg-red-500 shadow-none data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
				/>
				<RadioGroupItem
					value="orange"
					id="radio-07-orange"
					aria-label="orange"
					className="size-6 border-orange-500 bg-orange-500 shadow-none data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
				/>
				<RadioGroupItem
					value="yellow"
					id="radio-07-yellow"
					aria-label="yellow"
					className="size-6 border-yellow-500 bg-yellow-500 shadow-none data-[state=checked]:border-yellow-500 data-[state=checked]:bg-yellow-500"
				/>
				<RadioGroupItem
					value="green"
					id="radio-07-green"
					aria-label="green"
					className="size-6 border-green-500 bg-green-500 shadow-none data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500"
				/>
				{/* {Object.keys(colorHexMap).map((color) => (
					<RadioGroupItem
						key={color}
						value={color}
						id={`radio-${color}`}
						aria-label={color.charAt(0).toUpperCase() + color.slice(1)}
						className={cn(
							"size-6",
							`border-${color}-500`,
							`bg-${color}-500`,
							"shadow-none",
							{
								[`border-${color}-500 bg-${color}-500`]:
									selectedColor === color,
							}
						)}
					/>
				))} */}
			</RadioGroup>
		</fieldset>
	);
}
