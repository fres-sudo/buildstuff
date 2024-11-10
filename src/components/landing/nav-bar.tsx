import Link from "next/link";
import React from "react";
import BuildStuffLogo from "../logo";
import { Button } from "../ui/button";

const NavBar: React.FC = () => {
	return (
		<nav className="flex items-center justify-between px-6 py-4 border rounded-full">
			<BuildStuffLogo />
			<div className="flex flex-row items-center">
				<div className="hidden md:flex space-x-8 items-center mr-10">
					<Link
						href="/features"
						className="hover:underline underline-offset-4">
						Features
					</Link>
					<Link
						href="/pricing"
						className="hover:underline underline-offset-4">
						Pricing
					</Link>
					<Link
						href="/about"
						className="hover:underline underline-offset-4">
						About
					</Link>
					<Link
						href="/FAQ"
						className="hover:underline underline-offset-4">
						FAQ
					</Link>
					<Link
						href="/about"
						className="hover:underline underline-offset-4">
						About
					</Link>
				</div>
				<Button
					variant={"outline"}
					className="mr-2">
					Log in
				</Button>
				<Button>Get started</Button>
			</div>
		</nav>
	);
};

export default NavBar;
