import { DEFAULT_PET_IMAGE } from "@/contants/image";
import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
	.object({
		name: z.string().trim().min(3, { message: "Name is required" }).max(100),
		ownerName: z
			.string()
			.trim()
			.min(3, { message: "Owner name is required" })
			.max(100),
		imageUrl: z.union([
			z.literal(""),
			z.string().trim().url({ message: "Image url must be a valid url" }),
		]),
		age: z.coerce.number().int().positive().max(999),
		notes: z.string().trim().max(1000, "Cannot exceed 1000 characters"),
	})
	.transform((data) => ({
		...data,
		imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
	}));

export type TPetForm = z.infer<typeof petFormSchema>;
