import { formatOrderWhatsAppMessage } from "@/lib/whatsapp/format-order-message";
import { sendWhatsAppMessage } from "@/lib/whatsapp/send";
import { getOrderByIdAdmin } from "@/lib/supabase/orders";
import { getSiteSettingsAdmin } from "@/lib/supabase/site-settings";

export async function notifyNewOrderViaWhatsApp(orderId: string): Promise<void> {
  const provider = process.env.WHATSAPP_PROVIDER?.trim().toLowerCase();
  if (!provider || (provider !== "callmebot" && provider !== "meta")) {
    return;
  }

  const order = await getOrderByIdAdmin(orderId);
  if (!order) {
    console.warn(`WhatsApp notify: commande ${orderId} introuvable`);
    return;
  }

  const settings = await getSiteSettingsAdmin();
  const message = formatOrderWhatsAppMessage(order, settings.siteName);
  const result = await sendWhatsAppMessage(message);

  if (!result.ok) {
    console.error("WhatsApp notify failed:", result.reason);
    return;
  }

  console.info(`WhatsApp notify sent (${result.provider}) for order ${orderId}`);
}
