"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TabsContent } from "@/components/ui/tabs";

export default function AccountInfo() {
	const [name, setName] = useState("John Doe");
	const [email, setEmail] = useState("john@example.com");

	return (
		<>
			<div className="flex items-center space-x-4">
				<Avatar className="w-24 h-24">
					<AvatarImage
						src="https://github.com/shadcn.png"
						alt="User Avatar"
					/>
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<Button>Change Photo</Button>
			</div>
			<div className="space-y-4">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="name">Name</Label>
					<Input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="password">New Password</Label>
					<Input
						type="password"
						id="password"
					/>
				</div>
				<Button>Save Changes</Button>
			</div>
		</>
	);
}
