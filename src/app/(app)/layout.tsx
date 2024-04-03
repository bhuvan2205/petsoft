import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import { Toaster } from "@/components/ui/sonner";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import prisma from "@/lib/db";
import { ReactNode } from "react";

type LayoutProps = {
	children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
	console.log("Layout rendering...");
	const pets = await prisma.pet.findMany();

	if (!pets?.length) {
		throw new Error("Couldn't able to fetch pets!");
	}

	return (
		<>
			<BackgroundPattern />
			<div className="flex flex-col max-w-7xl mx-auto px-4 min-h-screen">
				<AppHeader />
				<SearchContextProvider>
					<PetContextProvider data={pets}>{children}</PetContextProvider>
				</SearchContextProvider>
				<AppFooter />
			</div>
			<Toaster position="top-right" />
		</>
	);
}
