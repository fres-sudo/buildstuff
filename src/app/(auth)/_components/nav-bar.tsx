"use client";

import Link from "next/link";
import React from "react";
import { LinkIcon, Menu, X } from "lucide-react";
import { BuildStuff, BuildStuffLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AuthNavBar = () => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	return (
		<nav className="flex items-center justify-between px-4 sm:px-6 py-4 border rounded-full mb-40">
			<BuildStuffLogo href="/" />
			<div className="flex flex-row items-center">
				<div className="hidden lg:flex space-x-8 items-center mr-10">
					<Link
						href="/#features"
						className="hover:underline underline-offset-4">
						Features
					</Link>
					<Link
						href="/#pricing"
						className="hover:underline underline-offset-4">
						Pricing
					</Link>
					<Link
						href="/#about"
						className="hover:underline underline-offset-4">
						About
					</Link>
					<Link
						href="/#FAQ"
						className="hover:underline underline-offset-4">
						FAQ
					</Link>
					<Link
						href="/#contact"
						className="hover:underline underline-offset-4">
						Contact
					</Link>
				</div>
				<Link href="/login">
					<Button
						variant={"outline"}
						className="mr-2 hidden sm:flex">
						Log in
					</Button>
				</Link>
				<Link href="/register">
					<Button className="hidden sm:flex ">Get started</Button>
				</Link>
				<div
					className="w-10 h-10 items-center flex lg:hidden ml-2 justify-center border rounded border-xl cursor-pointer"
					onClick={() => setIsMenuOpen(!isMenuOpen)}>
					<Menu />
				</div>
				<div
					className={`fixed top-0 right-0 w-64 h-full bg-black transition-transform transform ${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					} sm:hidden z-50`}>
					<div className="p-6 flex flex-col h-full">
						{/* Top Section with Close Icon and App Icon */}
						<div className="flex justify-between items-center">
							{/* App Icon (no decoration) */}
							<BuildStuff />
							{/* Close Icon */}
							<div
								className="border border-white border-opacity-30 h-10 w-10 inline-flex items-center justify-center rounded-lg cursor-pointer"
								onClick={toggleMenu}>
								<X className="text-white" />
							</div>
						</div>

						{/* Divider */}
						<Separator className="my-4" />

						{/* Navigation Links with Link Icon */}
						<nav className="flex flex-col space-y-4">
							<Link
								href="#features"
								onClick={toggleMenu}
								className="hover:underline underline-offset-4 flex items-center gap-2">
								<LinkIcon className="w-4 h-4 mr-2" />
								Features
							</Link>
							<Link
								href="#pricing"
								onClick={toggleMenu}
								className="hover:underline underline-offset-4 flex items-center gap-2">
								<LinkIcon className="w-4 h-4 mr-2" />
								Pricing
							</Link>
							<Link
								href="#about"
								onClick={toggleMenu}
								className="hover:underline underline-offset-4 flex items-center gap-2">
								<LinkIcon className="w-4 h-4 mr-2" />
								About
							</Link>
							<Link
								href="#FAQ"
								onClick={toggleMenu}
								className="hover:underline underline-offset-4 flex items-center gap-2">
								<LinkIcon className="w-4 h-4 mr-2" />
								FAQ
							</Link>
							<Link
								href="#contact"
								onClick={toggleMenu}
								className="hover:underline underline-offset-4 flex items-center gap-2 mb-4">
								<LinkIcon className="w-4 h-4 mr-2" />
								Contact
							</Link>

							<Link href="/login">
								<Button
									variant={"outline"}
									className="w-full">
									Log in
								</Button>
							</Link>
							<Link href="/register">
								<Button className="w-full">Get started</Button>
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default AuthNavBar;
