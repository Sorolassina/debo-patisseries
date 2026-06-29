import { CompteContent } from "@/app/compte/CompteContent";
import { getUserOrdersClient } from "@/lib/supabase/orders";
import { getCurrentUserProfile } from "@/lib/supabase/profile";

export default async function ComptePage() {
  const { userId, profile, email } = await getCurrentUserProfile();
  const orders = userId ? await getUserOrdersClient(userId) : [];

  return (
    <CompteContent
      userId={userId}
      profile={profile}
      email={email}
      orders={orders}
    />
  );
}
