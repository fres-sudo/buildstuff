"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/api/auth/auth-client";
import { api } from "@/trpc/react";

const ProvidersComponent = () => {
	return (
		<>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs">
					<span className="bg-background px-2 text-muted-foreground">
						or continue with
					</span>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Button
					variant="outline"
					onClick={async (e) => {
						await signIn.social({ provider: "github", callbackURL: "/home" });
					}}>
					<Icons.gitHub className="mr-2 h-4 w-4" />
					GitHub
				</Button>
				<Button
					variant="outline"
					onClick={async (e) => {
						await signIn.social({ provider: "google", callbackURL: "/home" });
					}}>
					<Icons.google className="mr-2 h-4 w-4" />
					Google
				</Button>
			</div>
		</>
	);
};

export default ProvidersComponent;
