import { FAQ } from "@/components/landing/FAQ";
import { Hero } from "@/components/landing/hero";
import NavBar from "@/components/landing/nav-bar";
import { Pricing } from "@/components/landing/pricing";

export default function Home() {
	return (
		<div className="max-w-screen-xl mx-auto p-8 text-center">
			<NavBar />
			<Hero />
			<Pricing />
			<FAQ />
		</div>
	);
}
