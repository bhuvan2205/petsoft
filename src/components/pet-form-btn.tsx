import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import SpinningBtn from "./spinning-btn";

type PetFormBtnProps = {
	actionType: "add" | "edit";
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" className="mt-5 self-end" disabled={pending}>
			{pending ? (
				<SpinningBtn />
			) : (
				<>{actionType === "add" ? "Add a new pet" : "Edit pet"}</>
			)}
		</Button>
	);
}
