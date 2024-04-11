"use client";

import { createCheckoutSession } from "@/actions/action";
import { Button } from "./ui/button";
import { useTransition } from "react";

export default function PaymentBtn() {
	const [isPending, startTransition] = useTransition();
	return (
		<Button
			disabled={isPending}
			onClick={() => {
				startTransition(async () => await createCheckoutSession());
			}}>
			Buy lifetime access for $299
		</Button>
	);
}
