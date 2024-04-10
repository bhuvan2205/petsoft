"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import AuthFormBtn from "./auth-form-btn";
import { login, signUp } from "@/actions/action";
import { useFormState } from "react-dom";

type AuthFormProps = { type: "login" | "signUp" };

export default function AuthForm({ type }: AuthFormProps) {
	const [errorSignUp, dispatchSignUp] = useFormState(signUp, undefined);
	const [errorLogin, dispatchLogin] = useFormState(login, undefined);

	return (
		<form action={type === "login" ? dispatchLogin : dispatchSignUp}>
			<div className="space-y-1">
				<Label>Email</Label>
				<Input id="email" name="email" type="email" required maxLength={30} />
			</div>
			<div className="mt-2 mb-4 space-y-1">
				<Label>Password</Label>
				<Input
					id="password"
					name="password"
					type="password"
					required
					minLength={6}
					maxLength={20}
				/>
			</div>
			<AuthFormBtn type={type} />

			{errorSignUp && <p className="text-red-500">{errorSignUp?.message}</p>}
			{errorLogin && <p className="text-red-500">{errorLogin?.message}</p>}
		</form>
	);
}
