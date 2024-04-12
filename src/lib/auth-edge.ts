import { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./server-utils";

export const nextAuthEdgeConfig = {
	pages: {
		signIn: "/login",
	},
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
					if (auth?.user?.hasAccess) {
						return Response.redirect(
							new URL("/app/dashboard", request.nextUrl)
						);
					} else {
						return true;
					}
				}
				return false;
			} else {
				if (isPaymentRoute) {
					return Response.redirect(new URL("/login", request.nextUrl));
				}
				if (!isPrivateRoute) {
					return true;
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
	providers: [],
} satisfies NextAuthConfig;
