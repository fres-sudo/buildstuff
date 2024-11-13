import AuthNavBar from "./_components/nav-bar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="max-w-screen-xl mx-auto px-4 py-8 sm:py-8 ">
			<AuthNavBar />
			{children}
		</div>
	);
};

export default AuthLayout;
