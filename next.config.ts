import type { NextConfig } from "next";

const nextConfig = {
	transpilePackages: ["lucide-react"],
	fastRefresh: true,
	async headers() {
		return [
			{
				// matching all API routes
				source: "/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
				],
			},
		];
	},
};
export default nextConfig;
