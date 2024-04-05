"use client";

import { addPet, deletePet, editPet } from "@/actions/action";
import useSearchContext from "@/hooks/useSearchContext";
import { PetEssentials } from "@/lib/type";
import { optimisticReducer } from "@/reducers/pet";
import { Pet } from "@prisma/client";
import {
	createContext,
	ReactNode,
	useMemo,
	useOptimistic,
	useState,
} from "react";
import { toast } from "sonner";

type TPetContext = {
	filteredPets: Pet[] | null;
	optimisticPets: Pet[] | null;
	selectedPetId: Pet["id"] | null;
	selectedPet: Pet | undefined;
	handleChangeSelectedPet: (id: Pet["id"]) => void;
	numberOfPets: number;
	handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
	handleAddPet: (pet: PetEssentials) => Promise<void>;
	handleEditPet: (petId: Pet["id"], pet: PetEssentials) => Promise<void>;
} | null;

type PetContextProviderProps = {
	data: Pet[];
	children: ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

function PetContextProvider({ data, children }: PetContextProviderProps) {
	const [optimisticPets, setOptimisticPets] = useOptimistic(
		data,
		optimisticReducer
	);

	const { searchText } = useSearchContext();
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

	const handleChangeSelectedPet = (petId: Pet["id"]) => {
		setSelectedPetId(petId);
	};

	const numberOfPets = optimisticPets?.length ?? 0;
	const selectedPet = optimisticPets?.find((pet) => pet.id === selectedPetId);

	const handleAddPet = async (pet: PetEssentials) => {
		setOptimisticPets({ action: "add", payload: pet });
		const error = await addPet(pet);
		if (error) {
			toast(error.message);
			return;
		}
	};

	const handleEditPet = async (petId: Pet["id"], updatedPet: PetEssentials) => {
		setOptimisticPets({ action: "edit", payload: { petId, updatedPet } });
		const error = await editPet(petId, updatedPet);
		if (error) {
			toast(error.message);
			return;
		}
	};

	const handleCheckoutPet = async (petId: Pet["id"]) => {
		setOptimisticPets({ action: "delete", payload: petId });
		const error = await deletePet(petId);
		if (error) {
			toast(error.message);
			return;
		}
		setSelectedPetId(null);
	};

	const filteredPets = useMemo(() => {
		return optimisticPets?.filter((pet) =>
			pet?.name?.toLowerCase()?.includes(searchText.toLowerCase())
		);
	}, [optimisticPets, searchText]);

	const contextValue = {
		optimisticPets,
		filteredPets,
		selectedPetId,
		handleChangeSelectedPet,
		selectedPet,
		numberOfPets,
		handleCheckoutPet,
		handleEditPet,
		handleAddPet,
	};

	return (
		<PetContext.Provider value={contextValue}>{children}</PetContext.Provider>
	);
}

export default PetContextProvider;
