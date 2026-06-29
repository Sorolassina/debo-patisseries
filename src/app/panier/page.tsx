import { PanierContent } from "@/app/panier/PanierContent";

export default async function PanierPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const paymentSuccess = params.success === "true";

  return <PanierContent paymentSuccess={paymentSuccess} />;
}
