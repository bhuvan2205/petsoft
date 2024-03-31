"use client";

import usePetContext from "@/hooks/usePetContext";
import Image from "next/image";

export default function PetList() {
	const { pets } = usePetContext();
	return (
		<ul className="bg-white border-b border-black/[0.08]">
			{pets?.map((pet) => (
				<li key={`pet-${pet.id}`}>
					<button className="flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-[#eff1f2] focus:bg-[#eff1f2] transition">
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
