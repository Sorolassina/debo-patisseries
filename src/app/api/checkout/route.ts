import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";

const BOX_LABELS: Record<string, string> = {
  petit: "Petit Coffret (6 pièces)",
  signature: "Coffret Signature (12 pièces)",
  grand: "Le Grand Écrin (24 pièces)",
};

const THEME_LABELS: Record<string, string> = {
  rose: "Rose Poudré",
  or: "Or Artisan",
  chocolat: "Chocolat Profond",
};

type CartItemPayload = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stripe = getStripe();
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    if (body.type === "cart" && Array.isArray(body.items)) {
      const items = body.items as CartItemPayload[];

      if (items.length === 0) {
        return NextResponse.json({ error: "Panier vide" }, { status: 400 });
      }

      const lineItems = items.map((item) => ({
        price_data: {
          currency: "xof",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        metadata: {
          order_type: "cart",
          product_ids: items.map((i) => i.id).join(","),
        },
        success_url: `${origin}/panier?success=true`,
        cancel_url: `${origin}/panier?cancelled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    const {
      boxSizeId,
      boxThemeId,
      customMessage,
      hidePrice,
      totalCents,
    } = body;

    if (!boxSizeId || !totalCents) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "xof",
            product_data: {
              name: `Coffret — ${BOX_LABELS[boxSizeId] ?? boxSizeId}`,
              description: `Thème: ${THEME_LABELS[boxThemeId] ?? boxThemeId}${customMessage ? ` | Message: ${customMessage.slice(0, 50)}...` : ""}`,
            },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_type: "coffret",
        box_size_id: boxSizeId,
        box_theme_id: boxThemeId ?? "",
        custom_message: customMessage ?? "",
        hide_price: hidePrice ? "true" : "false",
      },
      success_url: `${origin}/panier?success=true`,
      cancel_url: `${origin}/coffret?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement" },
      { status: 500 },
    );
  }
}
