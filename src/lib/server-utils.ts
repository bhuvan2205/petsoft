import "server-only";

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Pet, User } from "@prisma/client";
import prisma from "./db";

export const checkAuth = async () => {
	const session = await auth();
	if (!session?.user) {
		redirect("/login");
	}
	return session;
};

export const getPetById = async (id: Pet["id"]) => {
	return await prisma.pet.findUnique({
		where: {
			id,
		},
		select: {
			ownerId: true,
		},
	});
};

export const getUserPets = async (userId: User["id"]) => {
	return await prisma.pet.findMany({
		where: {
			ownerId: userId,
		},
	});
};

export const getUserByEmail = async (email: User["email"]) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
};
