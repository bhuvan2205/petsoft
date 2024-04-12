import { authSchema, TAuth } from "./schema";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./server-utils";
import { nextAuthEdgeConfig } from "./auth-edge";

const config = {
	...nextAuthEdgeConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				// Run every logins

				const validatedData = authSchema.safeParse(credentials);

				if (!validatedData.success) {
					return null;
				}

				const { email, password } = validatedData.data;

				const user = await getUserByEmail(email);

				if (!user) {
					console.log("No User found!");
					return null;
				}

				const isMatch = await bcrypt.compare(password, user.hashedPassword);

				if (!isMatch) {
					console.log("Invalid Credentials!");
					return null;
				}

				return user;
			},
		}),
	],
} satisfies NextAuthConfig;

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NextAuth(config);
