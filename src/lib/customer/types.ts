export type CustomerDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
};

export type CheckoutItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  kind?: "product" | "packaging";
  detail?: string;
};

export function validateCustomerDetails(
  input: Partial<CustomerDetails>,
): { ok: true; data: CustomerDetails } | { ok: false; error: string } {
  const fullName = input.fullName?.trim();
  const email = input.email?.trim();
  const phone = input.phone?.trim();
  const address = input.address?.trim();
  const city = input.city?.trim() || "Abidjan";

  if (!fullName) return { ok: false, error: "Le nom complet est obligatoire" };
  if (!email || !email.includes("@")) return { ok: false, error: "Email invalide" };
  if (!phone || phone.length < 8) return { ok: false, error: "Téléphone invalide" };
  if (!address) return { ok: false, error: "L'adresse de livraison est obligatoire" };

  return {
    ok: true,
    data: {
      fullName,
      email,
      phone,
      address,
      city,
      notes: input.notes?.trim() || undefined,
    },
  };
}
