import { SearchContext } from "@/context/search-context-provider";
import { useContext } from "react";

export default function useSearchContext() {
	const context = useContext(SearchContext);
	if (!context) {
		throw new Error("Consumer should be wrapped inside the Provider!");
	}
	return context;
}
