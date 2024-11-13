import { Shrikhand, Yarndings_20 } from "next/font/google";

const yarndings = Yarndings_20({ weight: "400", subsets: ["latin"] });
const shrikhand = Shrikhand({ weight: "400", subsets: ["latin"] });

export function BuildStuffLogo() {
	return (
		<a href="/home">
			<div className="flex flex-row items-center justify-start">
				<div
					className="w-10 h-10 flex font-xl items-center justify-center bg-background border rounded border-xl mr-4"
					style={{ fontFamily: yarndings.style.fontFamily, fontSize: 23 }}>
					b
				</div>
				<p style={{ fontFamily: shrikhand.style.fontFamily, fontSize: 23 }}>
					buildstuff
				</p>
			</div>
		</a>
	);
}

export function BuildStuff() {
	return (
		<p style={{ fontFamily: shrikhand.style.fontFamily, fontSize: 23 }}>
			buildstuff
		</p>
	);
}

export function BuildStuffIcon() {
	return (
		<div
			className="w-10 h-10 flex items-center justify-center bg-background border rounded border-xl"
			style={{ fontFamily: yarndings.style.fontFamily, fontSize: 23 }}>
			b
		</div>
	);
}
