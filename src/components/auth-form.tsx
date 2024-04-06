import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AuthForm() {
	return (
		<form>
			<div className="space-y-1">
				<Label>Email</Label>
				<Input id="email" type="email" />
			</div>
			<div className="mt-2 mb-4 space-y-1">
				<Label>Password</Label>
				<Input id="password" type="password" />
			</div>
			<Button>Sign up</Button>
		</form>
	);
}
