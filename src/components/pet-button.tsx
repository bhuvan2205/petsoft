"use client";

import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";

type PetButtonProps = {
	actionType: "edit" | "add" | "checkout";
	children: ReactNode;
	onClick?: () => void;
};

export default function PetButton({
	children,
	actionType,
	onClick,
}: PetButtonProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);

	if (actionType === "checkout") {
		return (
			<Button variant="secondary" onClick={() => onClick?.()}>
				{children}
			</Button>
		);
	}

	const toggleDialog = () => setIsFormOpen((prev) => !prev);

	return (
		<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
			<DialogTrigger asChild>
				{actionType === "add" ? (
					<Button size="icon">{children}</Button>
				) : (
					<Button variant="secondary">{children}</Button>
				)}
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{actionType === "add" ? "Add a new pet" : "Edit pet"}
					</DialogTitle>
				</DialogHeader>
				<PetForm onFormSubmit={toggleDialog} actionType={actionType} />
			</DialogContent>
		</Dialog>
	);
}
