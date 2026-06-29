import { PanierContent } from "@/app/panier/PanierContent";
import {
  getCurrentUserProfile,
  profileToCustomerDefaults,
} from "@/lib/supabase/profile";

export default async function PanierPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const paymentSuccess = params.success === "true";
  const { userId, profile, email } = await getCurrentUserProfile();
  const customerDefaults = profileToCustomerDefaults(profile, email);

  return (
    <PanierContent
      paymentSuccess={paymentSuccess}
      customerDefaults={customerDefaults}
      isLoggedIn={!!userId}
    />
  );
}
