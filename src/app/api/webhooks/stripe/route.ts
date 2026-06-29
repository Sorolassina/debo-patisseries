import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { markOrderPaid } from "@/lib/supabase/orders";
import { getStripe } from "@/lib/stripe/server";
import { notifyNewOrderViaWhatsApp } from "@/lib/whatsapp/notify-order";
import type Stripe from "stripe";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const orderId = session.metadata?.order_id;

      if (orderId) {
        await markOrderPaid(orderId, session.id);
        await notifyNewOrderViaWhatsApp(orderId);
      } else {
        const supabase = getServiceClient();
        await supabase.from("orders").insert({
          stripe_session_id: session.id,
          status: "paid",
          total_cents: session.amount_total ?? 0,
          custom_message: session.metadata?.custom_message || null,
          hide_price: session.metadata?.hide_price === "true",
          order_type: session.metadata?.order_type ?? "cart",
          customer_email: session.customer_details?.email ?? null,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
