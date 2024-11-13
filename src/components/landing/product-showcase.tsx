"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

function ProductShowcase() {
	const appImage = useRef<HTMLImageElement>(null);
	const { scrollYProgress } = useScroll({
		target: appImage,
		offset: ["start end", "end end"],
	});

	const rotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);
	const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
	return (
		<div className="">
			<div className="flex items-center justify-center relative">
				<motion.div
					style={{
						opacity: opacity,
						rotateX: rotateX,
						transformPerspective: "800px",
					}}>
					<Image
						ref={appImage}
						src="/product-showcase.png"
						width={900}
						height={200}
						className="m-2"
						alt="product"></Image>
				</motion.div>
				<div className="w-full lg:w-[900px] flex items-center justify-center absolute bottom-0 h-40 bg-gradient-to-t from-white/30 via-white/10 to-transparent"></div>
			</div>
		</div>
	);
}

export default ProductShowcase;
