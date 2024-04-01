"use client";

import usePetContext from "@/hooks/usePetContext";
import Image from "next/image";
import PetButton from "./pet-button";

export default function PetDetails() {
	const { selectedPet, handleCheckoutPet } = usePetContext();

	return (
		<section className="flex flex-col h-full w-full">
			{!selectedPet ? (
				<EmptyView />
			) : (
				<>
					<div className="flex items-center bg-white px-8 py-5 border-b border-light">
						<Image
							src={selectedPet?.imageUrl as string}
							alt="pet-image"
							height={75}
							width={75}
							className="rounded-full object-cover w-[75px] h-[75px]"
						/>
						<h2 className="text-3xl font-semibold leading-7 ml-5">
							{selectedPet?.name}
						</h2>
						<div className="ml-auto space-x-2">
							<PetButton actionType="edit">Edit</PetButton>
							<PetButton
								actionType="checkout"
								onClick={() => handleCheckoutPet(selectedPet?.id)}>
								Checkout
							</PetButton>
						</div>
					</div>
					<div className="flex justify-around py-10 px-5 text-center">
						<div>
							<h3 className="text-sm font-medium uppercase text-zinc-700">
								Owner name
							</h3>
							<p className="mt-1 text-lg text-zinc-800">
								{selectedPet?.ownerName}
							</p>
						</div>
						<div>
							<h3 className="text-sm font-medium uppercase text-zinc-700">
								Age
							</h3>
							<p className="mt-1 text-lg text-zinc-800">{selectedPet?.age}</p>
						</div>
					</div>
					<div className="bg-white px-5 py-7 rounded-md mb-9 mx-8 flex-1 border border-light">
						{selectedPet?.notes}
					</div>
				</>
			)}
		</section>
	);
}

function EmptyView() {
	return (
		<p className="h-full flex justify-center items-center text-2xl font-medium">
			No pet selected
		</p>
	);
}
