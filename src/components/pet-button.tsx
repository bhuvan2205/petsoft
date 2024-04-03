"use client";

import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import PetForm from "./pet-form";
import SpinningBtn from "./spinning-btn";

type PetButtonProps = {
	actionType: "edit" | "add" | "checkout";
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
};

export default function PetButton({
	children,
	actionType,
	onClick,
	disabled,
}: PetButtonProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);

	if (actionType === "checkout") {
		return (
			<Button
				variant="secondary"
				disabled={disabled}
				onClick={() => onClick?.()}>
				{disabled ? <SpinningBtn variant="dark" /> : children}
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
