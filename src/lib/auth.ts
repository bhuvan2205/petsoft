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
			const isPrivateRoute = request.nextUrl.pathname.includes("/app");
			const isPaymentRoute = request.nextUrl.pathname.includes("/payment");
			const isLoginRoute = request.nextUrl.pathname.includes("/login");
			const isSignUpRoute = request.nextUrl.pathname.includes("/signup");

			if (isLoggedIn) {
				if (isPrivateRoute) {
					if (auth?.user?.hasAccess) {
						return true;
					} else {
						return Response.redirect(new URL("/payment", request.nextUrl));
					}
				} else if (isLoginRoute || isSignUpRoute) {
					if (auth?.user?.hasAccess) {
						return Response.redirect(
							new URL("/app/dashboard", request.nextUrl)
						);
					} else {
						return Response.redirect(new URL("/payment", request.nextUrl));
					}
				} else if (isPaymentRoute) {
					return true;
				}
				return false;
			} else {
				if (!isPrivateRoute) {
					return true;
				}
				if (isPaymentRoute) {
					return Response.redirect(new URL("/login", request.nextUrl));
				}
				return false;
			}
		},
		jwt: async ({ token, user, trigger }) => {
			if (user) {
				token.ownerId = user.id;
				token.hasAccess = user.hasAccess;
				token.email = user.email!;
			}

			// When update the user
			if (trigger === "update") {
				const updatedUser = await getUserByEmail(token.email);
				if (updatedUser) {
					token.hasAccess = updatedUser.hasAccess;
				}
			}

			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user.id = token.ownerId;
				session.user.hasAccess = token.hasAccess;
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
