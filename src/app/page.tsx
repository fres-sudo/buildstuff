import { Contact } from "@/components/landing/contacts";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import NavBar from "@/components/landing/nav-bar";
import { Pricing } from "@/components/landing/pricing";
import ProductShowcase from "@/components/landing/product-showcase";

export default function Home() {
	return (
		<div className="max-w-screen-xl mx-auto px-4 py-8 sm:py-8 text-center">
			<NavBar />
			<Hero />
			<ProductShowcase />
			<section id="features">
				<Features />
			</section>
			<section id="pricing">
				<Pricing />
			</section>
			<section id="faq">
				<FAQ />
			</section>
			<section id="contact">
				<Contact />
			</section>
		</div>
	);
}
