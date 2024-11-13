"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

export default function Notifications() {
	return (
		<>
			<h2 className="text-2xl font-semibold mb-4">Email Notifications</h2>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label htmlFor="marketing">Marketing emails</Label>
					<Switch id="marketing" />
				</div>
				<div className="flex items-center justify-between">
					<Label htmlFor="updates">Product updates</Label>
					<Switch id="updates" />
				</div>
				<div className="flex items-center justify-between">
					<Label htmlFor="security">Security alerts</Label>
					<Switch id="security" />
				</div>
			</div>
		</>
	);
}
