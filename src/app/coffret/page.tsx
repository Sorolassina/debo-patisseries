import { CoffretContent } from "@/app/coffret/CoffretContent";
import {
  getCurrentUserProfile,
  profileToCustomerDefaults,
} from "@/lib/supabase/profile";
import { getActivePackagings } from "@/lib/supabase/packagings";
import { getAccompanimentProducts } from "@/lib/supabase/products";

export default async function CoffretPage() {
  const [upsells, packagings, profileData] = await Promise.all([
    getAccompanimentProducts(),
    getActivePackagings(),
    getCurrentUserProfile(),
  ]);
  const customerDefaults = profileToCustomerDefaults(
    profileData.profile,
    profileData.email,
  );

  return (
    <CoffretContent
      upsells={upsells}
      packagings={packagings}
      customerDefaults={customerDefaults}
      isLoggedIn={!!profileData.userId}
    />
  );
}