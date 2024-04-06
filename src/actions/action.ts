"use server";

import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/schema";
import { handleErrors, sleep } from "@/lib/utils";
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
		const message = handleErrors(error, "Could not add pet.");
		return message;
	}

	revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, pet: unknown) {
	await sleep(2000);

	const validatedPetID = petIdSchema.safeParse(petId);
	const validatedPet = petFormSchema.safeParse(pet);

	if (!validatedPet.success || !validatedPetID.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	try {
		await prisma.pet.update({
			where: {
				id: validatedPetID.data,
			},
			data: validatedPet.data,
		});
	} catch (error: unknown) {
		const message = handleErrors(error, "Could not edit pet.");
		return message;
	}

	revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
	const validatedPetID = petIdSchema.safeParse(petId);

	if (!validatedPetID.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	try {
		await prisma.pet.delete({
			where: {
				id: validatedPetID.data,
			},
		});
	} catch (error) {
		const message = handleErrors(error, "Could not delete pet.");
		return message;
	}

	revalidatePath("/app", "layout");
}
