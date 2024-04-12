import { NextAuthConfig } from "next-auth";
import prisma from "./db";

export const nextAuthEdgeConfig = {
	pages: {
		signIn: "/login",
	},
	callbacks: {
		// Runs every request
		authorized: ({ auth, request }) => {
			const isLoggedIn = Boolean(auth?.user);
			const isAppRoute = request.nextUrl.pathname.includes("/app");
			const isLoginRoute = request.nextUrl.pathname.includes("/login");
			const isSignUpRoute = request.nextUrl.pathname.includes("/signup");

			if (!isLoggedIn && isAppRoute) {
				return false;
			}

			if (isLoggedIn && isAppRoute && !auth?.user.hasAccess) {
				return Response.redirect(new URL("/payment", request.nextUrl));
			}

			if (isLoggedIn && isAppRoute && auth?.user.hasAccess) {
				return true;
			}

			if (
				isLoggedIn &&
				(isLoginRoute || isSignUpRoute) &&
				auth?.user.hasAccess
			) {
				return Response.redirect(new URL("/app/dashboard", request.nextUrl));
			}

			if (isLoggedIn && !isAppRoute && !auth?.user.hasAccess) {
				if (isLoginRoute || isSignUpRoute) {
					return Response.redirect(new URL("/payment", request.nextUrl));
				}

				return true;
			}

			if (!isLoggedIn && !isAppRoute) {
				return true;
			}

			return false;
		},
		jwt: async ({ token, user, trigger }) => {
			if (user) {
				token.ownerId = user.id;
				token.hasAccess = user.hasAccess;
				token.email = user.email!;
			}

			// When update the user
			if (trigger === "update") {
				const updatedUser = await prisma.user.findUnique({
					where: {
						email: token.email,
					},
				});
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
