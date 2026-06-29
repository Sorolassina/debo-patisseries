import type { OrderWithItems } from "@/lib/supabase/orders";
import { formatPrice } from "@/lib/utils/format";

const ORDER_TYPE_LABELS: Record<string, string> = {
  cart: "Panier",
  coffret: "Coffret",
  packaging: "Packaging",
};

export function formatOrderWhatsAppMessage(
  order: OrderWithItems,
  siteName = "Douceur du palais",
): string {
  const typeLabel = ORDER_TYPE_LABELS[order.order_type] ?? order.order_type;
  const lines: string[] = [
    `🛒 *Nouvelle commande — ${siteName}*`,
    "",
    `Type : ${typeLabel}`,
    `Total : *${formatPrice(order.total_cents)}*`,
    "",
    `👤 *Client*`,
    order.customer_name ?? "—",
    `📞 ${order.customer_phone ?? "—"}`,
    `✉️ ${order.customer_email ?? "—"}`,
    "",
    `📍 *Livraison*`,
    order.delivery_address ?? "—",
    order.delivery_city ? `${order.delivery_city}` : "",
  ];

  if (order.delivery_notes) {
    lines.push(`Note : ${order.delivery_notes}`);
  }

  if (order.custom_message) {
    lines.push("", `💬 Message coffret : ${order.custom_message}`);
    if (order.hide_price) {
      lines.push("(Prix masqué sur le coffret)");
    }
  }

  if (order.order_items.length > 0) {
    lines.push("", "*Articles :*");
    for (const item of order.order_items) {
      const label = item.item_name ?? "Article";
      lines.push(`• ${item.quantity}× ${label} — ${formatPrice(item.unit_price_cents * item.quantity)}`);
    }
  }

  lines.push("", `Réf. ${order.id.slice(0, 8)}`);

  return lines.filter(Boolean).join("\n");
}
