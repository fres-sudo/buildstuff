"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";
import { AccountPricing } from "../_components/account-pricing";

const plans = [
	{ name: "Basic", price: "$9.99/month" },
	{ name: "Pro", price: "$19.99/month" },
	{ name: "Enterprise", price: "$49.99/month" },
];

export default function PlanBilling() {
	const [selectedPlan, setSelectedPlan] = useState("Pro");

	return (
		<div className="flex flex-col m-4">
			<div>
				<h2 className="text-2xl font-semibold mb-4">Current Plan</h2>

				<Button className="mt-4">Change Plan</Button>
			</div>
			<AccountPricing />
			<div>
				<h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
				<div className="w-full max-w-md p-4 bg-white rounded-xl shadow-lg overflow-hidden">
					<div className="flex justify-between items-center mb-4">
						<div className="text-xl font-semibold">Credit Card</div>
						<div className="text-gray-500">Visa</div>
					</div>
					<motion.div
						className="bg-gradient-to-r from-purple-500 to-pink-500 h-40 rounded-lg p-4 text-white"
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 300 }}>
						<div className="flex justify-between items-center h-full">
							<div className="space-y-4">
								<div className="text-lg">**** **** **** 1234</div>
								<div className="text-sm">John Doe</div>
							</div>
							<div className="text-sm">
								<div>Exp: 12/25</div>
								<div>CVV: ***</div>
							</div>
						</div>
					</motion.div>
					<Button className="mt-4 w-full">Update Payment Method</Button>
				</div>
			</div>
		</div>
	);
}
