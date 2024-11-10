export declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name: string | null;
			email: string;
			emailVerified: Date | null;
			image: string | null;
			password: string | null;
			role: string | null;
			workType: string | null;
		};
	}
	interface User {
		id: string;
		name: string | null;
		email: string;
		emailVerified: Date | null;
		image: string | null;
		password: string | null;
		role: string | null;
		workType: string | null;
	}
}
