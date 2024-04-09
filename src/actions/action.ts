"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/schema";
import { handleErrors, sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ------ AUTH actions --------

export async function login(formData: FormData) {
	const authData = Object.fromEntries(formData.entries());

	await signIn("credentials", authData);
}

export async function logout() {
	await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
	const authData = Object.fromEntries(formData.entries());
	const { email, password } = authData;

	const salt = bcrypt.genSaltSync(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	try {
		await prisma.user.create({
			data: {
				email,
				hashedPassword,
			},
		});
	} catch (error: unknown) {
		const message = handleErrors(error, "Could not add pet.");
		return message;
	}

	await signIn("credentials", authData);
}

// ------- PET actions ---------

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
