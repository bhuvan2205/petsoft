import { DEFAULT_PET_IMAGE } from "@/contants/image";
import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
	.object({
		name: z.string().trim().min(3, { message: "Name is required" }).max(20),
		ownerName: z
			.string()
			.trim()
			.min(3, { message: "Owner name is required" })
			.max(30),
		imageUrl: z.union([
			z.literal(""),
			z.string().trim().url({ message: "Image url must be a valid url" }),
		]),
		age: z.coerce.number().int().positive().max(99),
		notes: z.string().trim().max(500, "Cannot exceed 500 characters"),
	})
	.transform((data) => ({
		...data,
		imageUrl: data?.imageUrl || DEFAULT_PET_IMAGE,
	}));

export type TPetForm = z.infer<typeof petFormSchema>;
