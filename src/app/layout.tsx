import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PetSoft - Pet daycare software",
	description: "Take care of people's pets responsibly with PetSoft.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} text-sm text-slate-900 bg-slate-200 min-h-screen`}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
