"use client";

import { Pet } from "@/lib/type";
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";

type TPetContext = {
	pets: Pet[] | null;
	setPets: Dispatch<SetStateAction<Pet[] | null>>;
	selectedPet: string | null;
	setSelectedPet: Dispatch<SetStateAction<string | null>>;
} | null;

type PetContextProviderProps = {
	data: Pet[];
	children: ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

function PetContextProvider({ data, children }: PetContextProviderProps) {
	const [pets, setPets] = useState<Pet[] | null>(data);
	const [selectedPet, setSelectedPet] = useState<string | null>(null);
	return (
		<PetContext.Provider value={{ pets, setPets, selectedPet, setSelectedPet }}>
			{children}
		</PetContext.Provider>
	);
}

export default PetContextProvider;
