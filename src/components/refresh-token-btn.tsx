"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function RefreshTokenBtn() {
	const { update, status, data: session } = useSession();
	const router = useRouter();

	return (
		<Button
			disabled={status === "loading" || session?.user.hasAccess}
			onClick={async () => {
				await update(true);
				router.push("/app/dashboard");
			}}>
			Access PetSoft
		</Button>
	);
}
