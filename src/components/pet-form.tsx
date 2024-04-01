import { useForm } from "react-hook-form";
import PetFormBtn from "./pet-form-btn";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { petFormSchema, TPetForm } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

type PetFormProps = {
	actionType: "add" | "edit";
	onFormSubmit: () => void;
};

export default function PetForm({ actionType, onFormSubmit }: PetFormProps) {
	const {
		register,
		trigger,
		getValues,
		formState: { errors },
		reset,
	} = useForm<TPetForm>({
		resolver: zodResolver(petFormSchema),
	});

	const handleAction = async () => {
		const formData = await trigger();

		if (!formData) return;

		const newPet = getValues();
		console.log("🚀 ~ action ~ newPet:", newPet);
		reset();
		onFormSubmit();
	};

	return (
		<form className="flex flex-col space-y-6" action={handleAction}>
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
