import { Pet } from "@prisma/client";

type ActionProps = { action: "add" | "edit" | "delete"; payload: any };

export const optimisticReducer = (
	state: Pet[],
	{ action, payload }: ActionProps
) => {
	switch (action) {
		case "add":
			return [...state, { ...payload, id: new Date().getTime().toString() }];
		case "edit":
			return state.map((pet) => {
				if (pet.id === payload?.petId) {
					return { ...pet, ...payload?.updatedPet };
				}
				return pet;
			});
		case "delete":
			return state.filter((pet) => pet?.id !== payload);
		default:
			return state;
	}
};
