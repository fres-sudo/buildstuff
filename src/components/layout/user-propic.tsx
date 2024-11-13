"use client";
import { useSession } from "@/lib/api/auth/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function UserPropic() {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return <Skeleton className="h-8 w-8 rounded-full" />;
	}
	return (
		<Link href="/account">
			<Avatar className="bg-muted p-4 rounded-full">
				{session.user.image ? (
					<AvatarImage
						src={session.user.image}
						alt={session.user.name}
					/>
				) : (
					<AvatarFallback className="rounded-lg">
						{session.user.name[0]}
					</AvatarFallback>
				)}
			</Avatar>
		</Link>
	);
}
