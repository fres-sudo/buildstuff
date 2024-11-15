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

export default function ColorRadio({
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
		if (onColorChange) {
			onColorChange(colorHexMap[value] ?? "#4B0082");
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
				{Object.keys(colorHexMap).map((color) => (
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
				))}
			</RadioGroup>
		</fieldset>
	);
}
