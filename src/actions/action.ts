"use server";

import { DEFAULT_PET_IMAGE } from "@/contants/image";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/type";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(formData: unknown) {
	await sleep(1000);

	const pet: PetEssentials = {
		name: formData.get("name"),
		ownerName: formData.get("ownerName"),
		age: parseInt(formData.get("age")),
		imageUrl: formData.get("imageUrl") || DEFAULT_PET_IMAGE,
		notes: formData.get("notes"),
	};
	try {
		await prisma.pet.create({
			data: {
				...pet,
			},
		});
	} catch (error: unknown) {
		return {
			message:
				error instanceof Error
					? (error?.message as string)
					: "Could not add pet.",
		};
	}

	revalidatePath("/app", "layout");
}

export async function editPet(petId: string, formData: unknown) {
	
	await sleep(1000);

	const pet: PetEssentials = {
		name: formData.get("name"),
		ownerName: formData.get("ownerName"),
		age: parseInt(formData.get("age")),
		imageUrl: formData.get("imageUrl") || DEFAULT_PET_IMAGE,
		notes: formData.get("notes"),
	};
	try {
		await prisma.pet.update({
			where: {
				id: petId,
			},
			data: {
				...pet,
			},
		});
	} catch (error: unknown) {
		return {
			message:
				error instanceof Error
					? (error?.message as string)
					: "Could not edit pet.",
		};
	}

	revalidatePath("/app", "layout");
}

export async function deletePet(petId: string) {
	try {
		await prisma.pet.delete({
			where: {
				id: petId,
			},
		});
	} catch (error) {
		return {
			message:
				error instanceof Error
					? (error?.message as string)
					: "Could not edit pet.",
		};
	}

	revalidatePath("/app", "layout");
}
