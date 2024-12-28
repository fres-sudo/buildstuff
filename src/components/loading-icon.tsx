import { Icons } from "./icons";

export default function LoadingIcon({ className }: { className?: string }) {
	return <Icons.spinner className={`size-3.5 animate-spin ${className}`} />;
}
