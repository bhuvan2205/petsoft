import { useForm } from "react-hook-form";
import PetFormBtn from "./pet-form-btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { petFormSchema, TPetForm } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import usePetContext from "@/hooks/usePetContext";
import { DEFAULT_PET_IMAGE } from "@/contants/image";

type PetFormProps = {
	actionType: "add" | "edit";
	onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
	const { selectedPetId, selectedPet, handleEditPet, handleAddPet } =
		usePetContext();
	const {
		register,
		formState: { errors },
		trigger,
		getValues,
	} = useForm<TPetForm>({
		resolver: zodResolver(petFormSchema),
		defaultValues:
			actionType === "edit"
				? {
						name: selectedPet?.name,
						ownerName: selectedPet?.ownerName,
						imageUrl: selectedPet?.imageUrl,
						age: selectedPet?.age,
						notes: selectedPet?.notes,
				  }
				: undefined,
	});
	return (
		<form
			className="flex flex-col space-y-6"
			action={async () => {
				const results = await trigger();
				if (!results) return;

				onFormSubmit();
				const pet = getValues();
				pet.imageUrl = pet.imageUrl || DEFAULT_PET_IMAGE;

				if (actionType === "edit") {
					handleEditPet(selectedPetId!, pet);
				} else if (actionType === "add") {
					handleAddPet(pet);
				}
			}}>
			<div className="space-y-1">
				<Label htmlFor="name">Name</Label>
				<Input id="name" {...register("name")} />
				{errors.name && <p className="text-red-500">{errors.name.message}</p>}
			</div>

			<div className="space-y-1">
				<Label htmlFor="ownerName">Owner Name</Label>
				<Input id="ownerName" {...register("ownerName")} />
				{errors.ownerName && (
					<p className="text-red-500">{errors.ownerName.message}</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="imageUrl">Image Url</Label>
				<Input id="imageUrl" {...register("imageUrl")} />
				{errors.imageUrl && (
					<p className="text-red-500">{errors.imageUrl.message}</p>
				)}
			</div>

			<div className="space-y-1">
				<Label htmlFor="age">Age</Label>
				<Input id="age" {...register("age")} />
				{errors.age && <p className="text-red-500">{errors.age.message}</p>}
			</div>

			<div className="space-y-1">
				<Label htmlFor="notes">Notes</Label>
				<Textarea id="notes" {...register("notes")} />
				{errors.notes && <p className="text-red-500">{errors.notes.message}</p>}
			</div>

			<PetFormBtn actionType={actionType} />
		</form>
	);
}
