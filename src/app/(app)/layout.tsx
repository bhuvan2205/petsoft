import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/backgroun-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import { Pet } from "@/lib/type";
import { ReactNode } from "react";

type LayoutProps = {
	children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
	const res = await fetch(
		"https://bytegrad.com/course-assets/projects/petsoft/api/pets"
	);

	if (!res.ok) {
		throw new Error("Couldn't able to fetch pets!");
	}

	const data: Pet[] = await res.json();

	return (
		<>
			<BackgroundPattern />
			<div className="flex flex-col max-w-7xl mx-auto px-4 min-h-screen">
				<AppHeader />
				<SearchContextProvider>
					<PetContextProvider data={data}>{children}</PetContextProvider>
				</SearchContextProvider>
				<AppFooter />
			</div>
		</>
	);
}
