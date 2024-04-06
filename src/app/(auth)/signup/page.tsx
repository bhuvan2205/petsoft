import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function Page() {
	return (
		<main>
			<H1 className="mb-5 text-center">Sign In</H1>
			<AuthForm />
			<p className="mt-6 text-sm text-zinc-500">
				Already have an account?{" "}
				<Link href="/signin" className="font-medium">
					Sign in
				</Link>
			</p>
		</main>
	);
}
