import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const handleSignIn = async () => {
		await signIn();
		router.push("/dashboard");
	};

	return (
		<nav>
			{/* ...existing code... */}
			{!session && <button onClick={handleSignIn}>Sign in</button>}
			{session && (
				<>
					<span>{session.user?.name}</span>
					<button onClick={() => signOut()}>Sign out</button>
				</>
			)}
		</nav>
	);
};

export default Navbar;
