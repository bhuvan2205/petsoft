"use client";

import { addPet } from "@/actions/action";
import useSearchContext from "@/hooks/useSearchContext";
import { PetEssentials } from "@/lib/type";
import { Pet } from "@prisma/client";
import { createContext, ReactNode, useMemo, useState } from "react";

type TPetContext = {
	filteredPets: Pet[] | null;
	pets: Pet[] | null;
	selectedPetId: string | null;
	selectedPet: Pet | undefined;
	handleChangeSelectedPet: (id: string) => void;
	numberOfPets: number;
	handleCheckoutPet: (id: string) => void;
	handleAddPet: (pet: PetEssentials) => void;
} | null;

type PetContextProviderProps = {
	data: Pet[];
	children: ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

function PetContextProvider({ data: pets, children }: PetContextProviderProps) {
	const { searchText } = useSearchContext();
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

	const handleChangeSelectedPet = (id: string) => {
		setSelectedPetId(id);
	};

	const numberOfPets = pets?.length ?? 0;

	const selectedPet = pets?.find((pet) => pet.id === selectedPetId);

	const handleAddPet = async (pet: PetEssentials) => {
		const error = await addPet(pet);
		if (error) {
			console.log(error.message);
			return;
		}
	};

	const handleCheckoutPet = (id: string) => {
		// setPets((prev) => prev?.filter((pet) => pet.id !== id));
		setSelectedPetId(null);
	};

	const filteredPets = useMemo(() => {
		return pets?.filter((pet) =>
			pet.name.toLowerCase().includes(searchText.toLowerCase())
		);
	}, [pets, searchText]);

	const contextValue = {
		pets,
		filteredPets,
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
