import H1 from "@/components/h1";
import PaymentBtn from "@/components/payment-btn";
import RefreshTokenBtn from "@/components/refresh-token-btn";

export default function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	return (
		<main className="flex flex-col items-center space-y-10">
			<H1>PetSoft access requires payment</H1>
			{!searchParams?.success && <PaymentBtn />}
			{searchParams?.success && <RefreshTokenBtn />}
			{searchParams?.success && (
				<p className="text-green-700 text-sm">
					Payment successful, you have access to PetSoft.
				</p>
			)}
			{searchParams?.cancelled && (
				<p className="text-red-600 text-sm">
					Payment cancelled, you can try again.
				</p>
			)}
		</main>
	);
}
