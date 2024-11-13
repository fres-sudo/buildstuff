import { Check, MoveRight, PhoneCall, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AccountPricing = () => (
	<div className="w-full">
		<div className="">
			<div className="flex text-center justify-center items-center gap-4 flex-col">
				<div className="flex pt-20 text-left flex-col w-full gap-4">
					<div className="">
						<RadioGroup>
							{[
								{ value: "selfhosted", title: "Basic", price: "$9.99" },
								{ value: "free", title: "Basic", price: "$9.99" },
								{ value: "pro", title: "Basic", price: "$9.99" },
							].map((plan) => (
								<RadioGroupItem
									key={plan.value}
									value={plan.value}
									className="flex items-center justify-start p-8 rounded-lg border">
									<Radio />
									<div className="flex flex-col">
										<div className="text-lg font-semibold">{plan.title}</div>
										<div className="text-sm">{plan.price}/month</div>
									</div>
									asdasd
								</RadioGroupItem>
							))}
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	</div>
);
