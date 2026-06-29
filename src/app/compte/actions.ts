"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Connectez-vous pour modifier votre profil" };

  const full_name = formData.get("full_name")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const default_address = formData.get("default_address")?.toString().trim() || null;
  const delivery_city = formData.get("delivery_city")?.toString().trim() || "Abidjan";

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name,
    phone,
    default_address,
    delivery_city,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  revalidatePath("/compte");
  revalidatePath("/panier");
  return { success: true };
}
