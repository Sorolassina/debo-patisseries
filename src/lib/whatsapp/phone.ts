/** Numéro international sans + (ex. 2250700000000). */
export function normalizeWhatsAppPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length < 8) return null;

  // Côte d'Ivoire : 10 chiffres locaux → préfixe 225
  if (digits.length === 10 && digits.startsWith("0")) {
    return `225${digits.slice(1)}`;
  }

  if (digits.startsWith("225") && digits.length >= 11) {
    return digits;
  }

  return digits;
}
