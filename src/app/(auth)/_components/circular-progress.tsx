const CircularProgress = ({ progress }: { progress: number }) => {
	const radius = 8;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg className="w-8 h-8 transform -rotate-90">
				{/* Background circle */}
				<circle
					cx="16"
					cy="16"
					r={radius}
					stroke="currentColor"
					strokeWidth="2"
					fill="transparent"
					className="text-muted"
				/>
				{/* Progress circle */}
				<circle
					cx="16"
					cy="16"
					r={radius}
					stroke="currentColor"
					strokeWidth="2"
					fill="transparent"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					className="text-white transition-all duration-300 ease-in-out"
				/>
			</svg>
		</div>
	);
};

export default CircularProgress;
