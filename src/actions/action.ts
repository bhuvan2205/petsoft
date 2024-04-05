"use server";

import prisma from "@/lib/db";
import { petFormSchema } from "@/lib/schema";
import { sleep } from "@/lib/utils";
import { Pet } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addPet(pet: unknown) {
	await sleep(2000);

	const validatedPet = petFormSchema.safeParse(pet);

	if (!validatedPet.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	try {
		await prisma.pet.create({
			data: validatedPet.data,
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

export async function editPet(petId: Pet['id'], pet: unknown) {
	await sleep(2000);

	const validatedPet = petFormSchema.safeParse(pet);

	if (!validatedPet.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	try {
		await prisma.pet.update({
			where: {
				id: petId,
			},
			data: validatedPet.data,
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

export async function deletePet(petId: Pet['id']) {
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
