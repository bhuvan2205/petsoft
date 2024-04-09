import {} from "next-auth";

declare module "@auth/core/jwt" {
	interface JWT {
		ownerId: string;
	}
}
