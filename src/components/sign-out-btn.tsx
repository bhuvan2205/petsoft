"use client";

import { Button } from "./ui/button";
import { logout } from "@/actions/action";

export default function SignOutBtn() {
	return <Button onClick={async () => await logout()}>Sign out</Button>;
}
