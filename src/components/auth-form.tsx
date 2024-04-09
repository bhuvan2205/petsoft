import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { login, signUp } from "@/actions/action";

type AuthFormProps = { type: "login" | "signUp" };

export default function AuthForm({ type }: AuthFormProps) {
	return (
		<form action={type === "login" ? login : signUp}>
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
			<Button>{type === "login" ? "Log In" : "Sign Up"}</Button>
		</form>
	);
}
