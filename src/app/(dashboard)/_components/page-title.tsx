export const PageTitle = ({
	title,
	description,
}: {
	title: string;
	description?: string;
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="text-2xl font-bold tracking-tight">
				{title}
				<p className="text-sm text-muted-foreground font-thin">{description}</p>
			</h2>
		</div>
	);
};
