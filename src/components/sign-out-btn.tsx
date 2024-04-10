"use client";

import { Button } from "./ui/button";
import { logout } from "@/actions/action";
import { useTransition } from "react";

export default function SignOutBtn() {
	const [isPending, startTransition] = useTransition();
	return (
		<Button
			disabled={isPending}
			onClick={() => startTransition(async () => await logout())}>
			Sign out
		</Button>
	);
}
