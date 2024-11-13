"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { TabsContent } from "@/components/ui/tabs";

const devices = [
	{ id: 1, name: "MacBook Pro", lastActive: "2 hours ago" },
	{ id: 2, name: "iPhone 12", lastActive: "5 minutes ago" },
	{ id: 3, name: "iPad Air", lastActive: "3 days ago" },
];

export default function Security() {
	const [connectedDevices, setConnectedDevices] = useState(devices);

	const handleEndAllSessions = () => {
		setConnectedDevices([]);
	};

	return (
		<>
			<h2 className="text-2xl font-semibold mb-4">Connected Devices</h2>
			<div className="space-y-4">
				<AnimatePresence>
					{connectedDevices.map((device) => (
						<motion.div
							key={device.id}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
							className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
							<div>
								<div className="font-semibold">{device.name}</div>
								<div className="text-sm text-gray-500">
									Last active: {device.lastActive}
								</div>
							</div>
							<Button
								variant="outline"
								size="sm">
								End Session
							</Button>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			{connectedDevices.length > 0 && (
				<Button
					onClick={handleEndAllSessions}
					className="mt-4">
					End All Sessions
				</Button>
			)}
		</>
	);
}
