import { MoveRight, PhoneCall } from "lucide-react";
import { Shrikhand } from "next/font/google";
import WordPullUp from "../ui/word-pull-up";
import BlurIn from "@/components/ui/blur-in";
import { Button } from "../ui/button";
import { HoverBorderGradient } from "../ui/hover-border-gradients";
import GradualSpacing from "../ui/gradual-spacing";

const shrikhand = Shrikhand({ weight: "400", subsets: ["latin"] });

export const Hero = () => {
	const words = `No fuss, no fluff, just a smart way to manage your projects and tasks. BuildStuff keeps you organized so you can focus on what you do best — building.`;
	return (
		<div className="w-full">
			<div className="container mx-auto">
				<div className="flex gap-8 pt-20 lg:pt-40 pb-40 items-center justify-center flex-col">
					<HoverBorderGradient
						containerClassName="rounded-full"
						as="button"
						className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 font-md">
						Read our launch article <MoveRight className="w-4 h-4 ml-2" />
					</HoverBorderGradient>
					<div className="flex gap-4 flex-col">
						<GradualSpacing
							className="text-4xl md:text-6xl max-w-3xl tracking-[-0.4rem] text-center font-regular md:leading-[2rem]"
							text="Just Enough Tools to"
						/>
						<span
							style={{
								fontFamily: shrikhand.style.fontFamily,
								fontSize: 70,
								letterSpacing: "0.00001em",
							}}>
							<WordPullUp
								className="text-6xl md:text-8xl"
								words="Get Stuff Done"
							/>
						</span>
						<BlurIn
							className="max-w-2xl tracking-tighter text-center font-thin text-muted-foreground"
							word={words}
						/>
					</div>
					<div className="flex flex-row gap-3">
						<Button
							size="lg"
							className="gap-4"
							variant="outline">
							Jump on a call <PhoneCall className="w-4 h-4" />
						</Button>
						<Button
							size="lg"
							className="gap-4">
							Sign up here <MoveRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
