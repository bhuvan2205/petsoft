import { PetContext } from "@/context/pet-context-provider";
import React, { useContext } from "react";

export default function usePetContext() {
	const context = useContext(PetContext);
	if (!context) {
		throw new Error("Consumer should be wrapped inside the Provider!");
	}
	return context;
}
