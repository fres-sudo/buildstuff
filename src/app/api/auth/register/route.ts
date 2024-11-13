import { db } from "@/lib/api/db";
import { users } from "@/lib/api/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().min(2),
	role: z.string(),
	workType: z.string(),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password, name, role, workType } =
			registerSchema.parse(body);

		// Check if user exists
		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await db
			.insert(users)
			.values({
				email,
				password: hashedPassword,
				name,
				role,
				workType,
			})
			.returning();

		return NextResponse.json({ user: user[0] }, { status: 201 });
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
