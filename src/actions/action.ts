"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/schema";
import { handleErrors, sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { redirect } from "next/navigation";

//  ------------------------------------------------------
// 						AUTH actions
// --------------------------------------------------------

export async function login(formData: unknown) {
	// Check if form data is valid
	if (!(formData instanceof FormData)) {
		return { message: "Invalid form data." };
	}

	await signIn("credentials", formData);

	redirect("/app/dashboard");
}

export async function logout() {
	await signOut({ redirectTo: "/" });
}

export async function signUp(formData: FormData) {
	// Check if form data is valid
	if (!(formData instanceof FormData)) {
		return { message: "Invalid form data." };
	}

	const authData = Object.fromEntries(formData.entries());
	const validatedData = authSchema.safeParse(authData);

	if (!validatedData.success) {
		return { message: "Invalid form data." };
	}

	const { email, password } = validatedData.data;

	const salt = await bcrypt.genSalt(10);
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

//  ------------------------------------------------------
// 						PET actions
// --------------------------------------------------------

export async function addPet(pet: unknown) {
	await sleep(1000);
	const session = await checkAuth();

	const validatedPet = petFormSchema.safeParse(pet);

	if (!validatedPet.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	try {
		await prisma.pet.create({
			data: {
				...validatedPet.data,
				owner: {
					connect: {
						id: session.user.id,
					},
				},
			},
		});
	} catch (error: unknown) {
		const message = handleErrors(error, "Could not add pet.");
		return message;
	}

	revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, pet: unknown) {
	await sleep(1000);
	const session = await checkAuth();

	const validatedPetID = petIdSchema.safeParse(petId);
	const validatedPet = petFormSchema.safeParse(pet);

	if (!validatedPet.success || !validatedPetID.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	// authorization check
	const userPet = await getPetById(validatedPetID.data);

	if (!userPet) {
		return {
			message: "Could not find pet.",
		};
	}

	if (userPet?.ownerId !== session.user.id) {
		return {
			message: "You are not authorized to edi this pet!",
		};
	}

	// Update data from db
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
	await sleep(1000);
	const session = await checkAuth();

	const validatedPetID = petIdSchema.safeParse(petId);

	if (!validatedPetID.success) {
		return {
			message: "Invalid pet data.",
		};
	}

	// authorization check
	const pet = await getPetById(validatedPetID.data);

	if (!pet) {
		return {
			message: "Could not find pet.",
		};
	}

	if (pet?.ownerId !== session.user.id) {
		return {
			message: "You are not authorized to delete this pet!",
		};
	}

	// Delete data from DB
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
