import { createClient } from "@/lib/supabase/server";
import type { CustomerDetails } from "@/lib/customer/types";
import type { Profile } from "@/lib/types/database";

export type ProfileView = {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  defaultAddress: string | null;
  deliveryCity: string;
};

function mapProfile(row: Profile): ProfileView {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    defaultAddress: row.default_address,
    deliveryCity: row.delivery_city,
  };
}

export async function getCurrentUserProfile(): Promise<{
  userId: string | null;
  profile: ProfileView | null;
  email: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { userId: null, profile: null, email: null };
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    profile: data ? mapProfile(data as Profile) : null,
    email: user.email ?? null,
  };
}

export function profileToCustomerDefaults(
  profile: ProfileView | null,
  email: string | null,
): Partial<CustomerDetails> {
  return {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? email ?? "",
    phone: profile?.phone ?? "",
    address: profile?.defaultAddress ?? "",
    city: profile?.deliveryCity ?? "Abidjan",
  };
}
