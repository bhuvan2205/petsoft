import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function sleep(ms = 2000) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const handleErrors = (error: unknown, errorMessage: string) => ({
	message: error instanceof Error ? (error?.message as string) : errorMessage,
});
