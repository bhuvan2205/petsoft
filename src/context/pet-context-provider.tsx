"use client";

import { addPet, deletePet, editPet } from "@/actions/action";
import useSearchContext from "@/hooks/useSearchContext";
import { PetEssentials } from "@/lib/type";
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
	selectedPetId: string | null;
	selectedPet: Pet | undefined;
	handleChangeSelectedPet: (id: string) => void;
	numberOfPets: number;
	handleCheckoutPet: (id: string) => Promise<void>;
	handleAddPet: (pet: PetEssentials) => Promise<void>;
	handleEditPet: (petId: string, pet: PetEssentials) => Promise<void>;
} | null;

type PetContextProviderProps = {
	data: Pet[];
	children: ReactNode;
};

export const PetContext = createContext<TPetContext | null>(null);

function PetContextProvider({ data, children }: PetContextProviderProps) {
	const [optimisticPets, setOptimisticPets] = useOptimistic(
		data,
		(state, newPet) => [
			...state,
			{ ...newPet, id: new Date().getTime().toString() },
		]
	);

	const { searchText } = useSearchContext();
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

	const handleChangeSelectedPet = (id: string) => {
		setSelectedPetId(id);
	};

	const numberOfPets = optimisticPets?.length ?? 0;

	const selectedPet = optimisticPets?.find((pet) => pet.id === selectedPetId);

	const handleAddPet = async (pet: PetEssentials) => {
		setOptimisticPets(pet);
		const error = await addPet(pet);
		if (error) {
			toast(error.message);
			return;
		}
	};

	const handleEditPet = async (petId: string, pet: PetEssentials) => {
		setOptimisticPets((prev) =>
			prev.map((pet) => {
				if (pet?.id === petId) {
					return {
						...pet,
					};
				}
				return pet;
			})
		);
		const error = await editPet(petId, pet);
		if (error) {
			toast(error.message);
			return;
		}
	};

	const handleCheckoutPet = async (petId: string) => {
		setOptimisticPets((prev) => prev?.filter((pet) => pet?.id !== petId));
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
