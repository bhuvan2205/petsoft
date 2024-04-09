import { authSchema, TAuth } from "./schema";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./server-utils";

const config = {
	pages: {
		signIn: "/login",
	},
	session: {
		maxAge: 30 * 24 * 60 * 60,
	},
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
	callbacks: {
		// Runs every request
		authorized: ({ auth, request }) => {
			const isLoggedIn = Boolean(auth?.user);
			const isTryToAccessApp = request.nextUrl.pathname.includes("/app");

			if (!isLoggedIn && isTryToAccessApp) {
				return false;
			}

			if (!isLoggedIn && !isTryToAccessApp) {
				return true;
			}

			if (isLoggedIn && isTryToAccessApp) {
				return true;
			}

			if (isLoggedIn && !isTryToAccessApp) {
				return Response.redirect(new URL("/app/dashboard", request.nextUrl));
			}

			return false;
		},
		jwt: ({ token, user }) => {
			if (user) {
				token.ownerId = user.id;
			}

			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user.id = token.ownerId;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;

export const {
	auth,
	signIn,
	signOut,
	handlers: { GET, POST },
} = NextAuth(config);
