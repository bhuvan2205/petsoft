"use server";

import { signIn, signOut } from "@/lib/auth-no-edge";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/schema";
import { handleErrors, sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//  ------------------------------------------------------
// 						AUTH actions
// --------------------------------------------------------

export async function login(prev: unknown, formData: unknown) {
	// Check if form data is valid
	if (!(formData instanceof FormData)) {
		return { message: "Invalid form data." };
	}

	try {
		await signIn("credentials", formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin": {
					return { message: "Invalid credentials." };
				}
				default: {
					return { message: "Not able to log in." };
				}
			}
		}
		throw error; // next.js redirects throws error, so we need to rethrow it
	}
}

export async function logout() {
	await signOut({ redirectTo: "/" });
}

export async function signUp(prev: unknown, formData: FormData) {

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
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			return { message: "Email already exists." };
		}
		const message = handleErrors(error, "Could not create user");
		return message;
	}

	await signIn("credentials", authData);
}

//  ------------------------------------------------------
// 						PET actions
// --------------------------------------------------------

export async function addPet(pet: unknown) {
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

//  ------------------------------------------------------
// 						PAYMENT actions
// --------------------------------------------------------

export async function createCheckoutSession() {
	const session = await checkAuth();
	const checkoutSession = await stripe.checkout.sessions.create({
		customer_email: session.user.email,
		line_items: [
			{
				price: "price_1P43mhSJ28NGiTWwNPblAgsX",
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
		cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
	});

	//redirect user
	redirect(checkoutSession?.url);
}
