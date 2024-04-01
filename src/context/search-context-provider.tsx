"use client";

import { createContext, ReactNode, useState } from "react";

type TSearchContext = {
	searchText: string;
	handleChangeSearchText: (text: string) => void;
} | null;

type SearchPetContextProviderProps = {
	children: ReactNode;
};

export const SearchContext = createContext<TSearchContext | null>(null);

function SearchContextProvider({ children }: SearchPetContextProviderProps) {
	const [searchText, setSearchText] = useState("");

	const handleChangeSearchText = (text: string) => {
		setSearchText(text);
	};

	const contextValue = {
		searchText,
		handleChangeSearchText,
	};

	return (
		<SearchContext.Provider value={contextValue}>
			{children}
		</SearchContext.Provider>
	);
}

export default SearchContextProvider;
