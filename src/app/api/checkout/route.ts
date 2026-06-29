import { NextResponse } from "next/server";

import { validateCustomerDetails, type CheckoutItem } from "@/lib/customer/types";

import { createClient } from "@/lib/supabase/server";

import { createPendingOrder } from "@/lib/supabase/orders";

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



export async function POST(request: Request) {

  try {

    const body = await request.json();

    const stripe = getStripe();

    const origin =

      request.headers.get("origin") ??

      process.env.NEXT_PUBLIC_APP_URL ??

      "http://localhost:3000";



    const customerCheck = validateCustomerDetails(body.customer ?? {});

    if (!customerCheck.ok) {

      return NextResponse.json({ error: customerCheck.error }, { status: 400 });

    }



    const supabase = await createClient();

    const {

      data: { user },

    } = await supabase.auth.getUser();



    if (body.type === "cart" && Array.isArray(body.items)) {

      const items = body.items as CheckoutItem[];



      if (items.length === 0) {

        return NextResponse.json({ error: "Panier vide" }, { status: 400 });

      }



      const totalCents = items.reduce(

        (sum, item) => sum + item.priceCents * item.quantity,

        0,

      );



      const pending = await createPendingOrder({

        userId: user?.id ?? null,

        customer: customerCheck.data,

        orderType: "cart",

        totalCents,

        items,

      });



      if ("error" in pending) {

        return NextResponse.json({ error: pending.error }, { status: 500 });

      }



      const lineItems = items.map((item) => ({

        price_data: {

          currency: "xof",

          product_data: {

            name:

              item.kind === "packaging"

                ? `Packaging — ${item.name}`

                : item.name,

            description: item.detail?.slice(0, 200),

          },

          unit_amount: item.priceCents,

        },

        quantity: item.quantity,

      }));



      const session = await stripe.checkout.sessions.create({

        mode: "payment",

        payment_method_types: ["card"],

        customer_email: customerCheck.data.email,

        line_items: lineItems,

        metadata: {

          order_id: pending.orderId,

          order_type: "cart",

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



    const coffretName = `Coffret — ${BOX_LABELS[boxSizeId] ?? boxSizeId}`;

    const pending = await createPendingOrder({

      userId: user?.id ?? null,

      customer: customerCheck.data,

      orderType: "coffret",

      totalCents,

      items: [

        {

          id: `coffret-${boxSizeId}`,

          name: coffretName,

          priceCents: totalCents,

          quantity: 1,

        },

      ],

      customMessage,

      hidePrice,

      boxSizeId: boxSizeId,

      boxThemeId: boxThemeId ?? null,

    });



    if ("error" in pending) {

      return NextResponse.json({ error: pending.error }, { status: 500 });

    }



    const session = await stripe.checkout.sessions.create({

      mode: "payment",

      payment_method_types: ["card"],

      customer_email: customerCheck.data.email,

      line_items: [

        {

          price_data: {

            currency: "xof",

            product_data: {

              name: coffretName,

              description: `Thème: ${THEME_LABELS[boxThemeId] ?? boxThemeId}${customMessage ? ` | Message: ${customMessage.slice(0, 50)}...` : ""}`,

            },

            unit_amount: totalCents,

          },

          quantity: 1,

        },

      ],

      metadata: {

        order_id: pending.orderId,

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

