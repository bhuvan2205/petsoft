import Logo from "@/components/logo";
import React, { ReactNode } from "react";

type LayoutProps = {
	children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	return (
		<div className="flex flex-col justify-center gap-y-5 items-center min-h-screen">
			<Logo />
			{children}
		</div>
	);
}
