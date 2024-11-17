import {} from "lucide-react";
import dynamic from "next/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { LucideProps } from "lucide-react";

const iconIdentifiers = [
	"Home",
	"Briefcase",
	"Star",
	"Heart",
	"Settings",
	"Calendar",
	"Bell",
	"Globe",
	"MessageCircle",
	"Monitor",
	"Smartphone",
	"Tablet",
	"Laptop",
	"Server",
	"Database",
	"MapPin",
	"Compass",
	"Camera",
	"Film",
	"Music",
	"Book",
	"ShoppingCart",
	"CreditCard",
	"Wallet",
	"Clock",
	"Mail",
	"Phone",
	"User",
	"Users",
	"Key",
	"Lock",
	"Shield",
	"Globe2",
	"Cloud",
	"Sun",
	"Moon",
	"Settings2",
	"Laptop2",
	"Airplay",
	"Anchor",
	"Aperture",
	"Archive",
	"AtSign",
	"Award",
];

// Function to get a random icon identifier
export const getRandomIcon = (): keyof typeof dynamicIconImports => {
	const randomIndex = Math.floor(Math.random() * iconIdentifiers.length);
	return iconIdentifiers[randomIndex] as keyof typeof dynamicIconImports;
};

// Function to dynamically import the icon component
export const getIcon = (name: string, props?: LucideProps) => {
	const iconName = name in dynamicIconImports ? name : "Home"; // Fallback to "Home" icon if name is not valid
	const LucideIcon = dynamic(
		dynamicIconImports[name as keyof typeof dynamicIconImports]
	);
	return <LucideIcon {...props} />;
};
