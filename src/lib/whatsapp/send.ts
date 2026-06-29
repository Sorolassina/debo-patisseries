import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeWhatsAppPhone } from "@/lib/whatsapp/phone";

export type WhatsAppProvider = "callmebot" | "meta";

export type WhatsAppSendResult =
  | { ok: true; provider: WhatsAppProvider }
  | { ok: false; reason: string };

async function resolveNotifyPhone(): Promise<string | null> {
  const fromEnv = process.env.WHATSAPP_NOTIFY_PHONE?.trim();
  if (fromEnv) {
    return normalizeWhatsAppPhone(fromEnv);
  }

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("site_settings")
      .select("whatsapp")
      .eq("id", 1)
      .maybeSingle();

    if (data?.whatsapp) {
      return normalizeWhatsAppPhone(data.whatsapp);
    }
  } catch {
    // ignore
  }

  return null;
}

async function sendViaCallMeBot(phone: string, text: string): Promise<WhatsAppSendResult> {
  const apiKey = process.env.WHATSAPP_CALLMEBOT_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, reason: "WHATSAPP_CALLMEBOT_API_KEY manquant" };
  }

  const url = new URL("https://api.callmebot.com/whatsapp.php");
  url.searchParams.set("phone", phone);
  url.searchParams.set("text", text);
  url.searchParams.set("apikey", apiKey);

  const res = await fetch(url.toString(), { method: "GET" });
  const body = await res.text();

  if (!res.ok) {
    return { ok: false, reason: `CallMeBot HTTP ${res.status}: ${body.slice(0, 200)}` };
  }

  if (/error/i.test(body)) {
    return { ok: false, reason: `CallMeBot: ${body.slice(0, 200)}` };
  }

  return { ok: true, provider: "callmebot" };
}

async function sendViaMeta(phone: string, text: string): Promise<WhatsAppSendResult> {
  const accessToken = process.env.WHATSAPP_META_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_META_PHONE_NUMBER_ID?.trim();

  if (!accessToken || !phoneNumberId) {
    return {
      ok: false,
      reason: "WHATSAPP_META_ACCESS_TOKEN ou WHATSAPP_META_PHONE_NUMBER_ID manquant",
    };
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text },
      }),
    },
  );

  const data = (await res.json()) as { error?: { message?: string } };

  if (!res.ok) {
    return {
      ok: false,
      reason: `Meta API: ${data.error?.message ?? res.statusText}`,
    };
  }

  return { ok: true, provider: "meta" };
}

export async function sendWhatsAppMessage(text: string): Promise<WhatsAppSendResult> {
  const provider = (process.env.WHATSAPP_PROVIDER?.trim().toLowerCase() ??
    "") as WhatsAppProvider | "";

  if (provider !== "callmebot" && provider !== "meta") {
    return { ok: false, reason: "WHATSAPP_PROVIDER non configuré (callmebot ou meta)" };
  }

  const phone = await resolveNotifyPhone();
  if (!phone) {
    return {
      ok: false,
      reason: "Numéro destinataire introuvable (WHATSAPP_NOTIFY_PHONE ou WhatsApp admin)",
    };
  }

  if (provider === "callmebot") {
    return sendViaCallMeBot(phone, text);
  }

  return sendViaMeta(phone, text);
}
