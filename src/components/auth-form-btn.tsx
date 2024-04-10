"use client";

import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
	type: "login" | "signUp";
};

export default function AuthFormBtn({ type }: AuthFormBtnProps) {
	const { pending } = useFormStatus();
	return (
		<Button disabled={pending}>
			{type === "login" ? "Log In" : "Sign Up"}
		</Button>
	);
}
