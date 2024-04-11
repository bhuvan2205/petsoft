import { User } from "@prisma/client";
import { User } from "next-auth";

declare module "next-auth" {
	interface User {
		hasAccess: boolean;
		email: string;
	}
	interface Session {
		user: User & {
			id: string;
		};
	}
}

declare module "@auth/core/jwt" {
	interface JWT {
		ownerId: string;
		email: string;
		hasAccess: boolean;
	}
}
