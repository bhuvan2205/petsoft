"use client";

import usePetContext from "@/hooks/usePetContext";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function PetList() {
	const { filteredPets, handleChangeSelectedPet, selectedPetId } =
		usePetContext();

	return (
		<ul className="bg-white border-b border-light">
			{filteredPets?.map((pet) => (
				<li key={`pet-${pet.id}`}>
					<button
						onClick={() => handleChangeSelectedPet(pet.id)}
						className={cn(
							"flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition",
							{
								"bg-[#eff1f2]": selectedPetId === pet.id,
							}
						)}>
						<Image
							src={pet.imageUrl}
							alt={pet.name}
							height={45}
							width={45}
							className="rounded-full object-cover w-[45px] h-[45px]"
						/>
						<p className="font-semibold">{pet.name}</p>
					</button>
				</li>
			))}
		</ul>
	);
}
