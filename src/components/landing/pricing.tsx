import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NumberTicker from "../ui/number-ticker";

export const Pricing = () => (
	<div className="w-full py-20 lg:py-40">
		<div className="container mx-auto">
			<div className="flex text-center justify-center items-center gap-4 flex-col">
				<Badge>Pricing</Badge>
				<div className="flex gap-2 flex-col">
					<h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
						Prices that make sense!
					</h2>
					<p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
						Managing a small business today is already tough.
					</p>
				</div>
				<div className="grid text-left w-full grid-cols-3 lg:grid-cols-4 divide-x pt-20">
					<div className="col-span-3 lg:col-span-1"></div>
					<div className="px-3 py-1 md:px-6 md:py-4  gap-2 flex flex-col">
						<p className="text-2xl tracking-tight">Self Hosted</p>
						<p className="text-sm text-muted-foreground">
							Our goal is to streamline SMB trade, making it easier and faster
							than ever for everyone and everywhere.
						</p>
						<p className="flex flex-col lg:flex-row lg:items-end gap-2 text-xl mt-8">
							<span className="text-4xl">Free</span>
							<span className="text-sm text-muted-foreground">forever</span>
						</p>
						<Button
							variant="outline"
							className="gap-4 mt-8">
							Try it <MoveRight className="w-4 h-4" />
						</Button>
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
						<p className="text-2xl tracking-tight">Small Builders</p>
						<p className="text-sm text-muted-foreground">
							Our goal is to streamline SMB trade, making it easier and faster
							than ever for everyone and everywhere.
						</p>
						<p className="flex flex-col items-start justify-start lg:flex-row lg:items-end gap-2 text-xl mt-8">
							<span className="text-4xl">Free</span>
							<span className="text-sm text-muted-foreground">forever</span>
						</p>
						<Button className="gap-4 mt-8">
							Try it <MoveRight className="w-4 h-4" />
						</Button>
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
						<p className="text-2xl tracking-tight">Startuppers</p>
						<p className="text-sm text-muted-foreground">
							Our goal is to streamline SMB trade, making it easier and faster
							than ever for everyone and everywhere.
						</p>
						<p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
							<span className="text-4xl flex">
								${" "}
								<NumberTicker
									className="tracking-tighter whitespace-pre-wrap font-medium text-black dark:text-white"
									value={4.99}
									decimalPlaces={2}
								/>
							</span>
							<span className="text-sm text-muted-foreground">
								{" "}
								/ user / month
							</span>
						</p>
						<Button
							variant="outline"
							className="gap-4 mt-8">
							Contact us <PhoneCall className="w-4 h-4" />
						</Button>
					</div>
					<p className="px-3 lg:px-6 col-span-3 lg:col-span-1 text-muted-foreground tracking-tight py-4">
						Features
					</p>
					<div></div>
					<div></div>
					<div></div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">SSO</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
						AI Assistant
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Minus className="w-4 h-4 text-muted-foreground" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
						Version Control
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Minus className="w-4 h-4 text-muted-foreground" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
						Members
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<p className="text-muted-foreground text-sm">5 members</p>
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<p className="text-muted-foreground text-sm">25 members</p>
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<p className="text-muted-foreground text-sm">100+ members</p>
					</div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
						Multiplayer Mode
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Minus className="w-4 h-4 text-muted-foreground" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					{/* New Line */}
					<div className="px-3 lg:px-6 col-span-3 lg:col-span-1 py-4">
						Orchestration
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Minus className="w-4 h-4 text-muted-foreground" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
					<div className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
						<Check className="w-4 h-4 text-primary" />
					</div>
				</div>
			</div>
			<p className="font-thin text-xs text-muted-foreground mt-2 place-items-end justify-end items-end">
				*Billed annualy
			</p>
		</div>
	</div>
);
