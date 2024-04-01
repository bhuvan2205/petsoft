"use client";

import { Pet } from "@/lib/type";
import { createContext, ReactNode, useState } from "react";

type TPetContext = {
	pets: Pet[] | null;
	selectedPetId: string | null;
	selectedPet: Pet | undefined;
	handleChangeSelectedPet: (id: string) => void;
	numberOfPets: number;
	handleCheckoutPet: (id: string) => void;
	handleAddPet: (pet: Pet) => void;
} | null;

type PetContextProviderProps = {
	data: Pet[];
	children: ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

function PetContextProvider({ data, children }: PetContextProviderProps) {
	const [pets, setPets] = useState<Pet[]>(data);
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

	const handleChangeSelectedPet = (id: string) => {
		setSelectedPetId(id);
	};

	const numberOfPets = pets?.length ?? 0;

	const selectedPet = pets?.find((pet) => pet.id === selectedPetId);

	const handleAddPet = (pet: Pet) => {
		setPets((prev) => [...(prev ?? []), pet]);
	};

	const handleCheckoutPet = (id: string) => {
		setPets((prev) => prev?.filter((pet) => pet.id !== id));
		setSelectedPetId(null);
	};

	const contextValue = {
		pets,
		selectedPetId,
		handleChangeSelectedPet,
		selectedPet,
		numberOfPets,
		handleCheckoutPet,
		handleAddPet,
	};

	return (
		<PetContext.Provider value={contextValue}>{children}</PetContext.Provider>
	);
}

export default PetContextProvider;
