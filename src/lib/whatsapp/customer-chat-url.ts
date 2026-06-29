import { normalizeWhatsAppPhone } from "@/lib/whatsapp/phone";

export function buildCustomerWhatsAppUrl(
  phone: string,
  message: string,
): string | null {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function buildOrderCustomerWhatsAppMessage(input: {
  customerName: string | null;
  orderRef: string;
  totalLabel: string;
  siteName?: string;
}): string {
  const greeting = input.customerName
    ? `Bonjour ${input.customerName},`
    : "Bonjour,";
  const shop = input.siteName ?? "Douceur du palais";

  return [
    greeting,
    "",
    `Nous vous contactons au sujet de votre commande (${input.totalLabel}) chez ${shop}.`,
    `Réf. : ${input.orderRef}`,
    "",
    "Cordialement,",
    shop,
  ].join("\n");
}
