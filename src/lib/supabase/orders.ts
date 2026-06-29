import { createAdminClient } from "@/lib/supabase/admin";
import type { CheckoutItem, CustomerDetails } from "@/lib/customer/types";
import type { Order, OrderItem } from "@/lib/types/database";

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

async function resolveProductId(slugOrId: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: bySlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (bySlug) return bySlug.id;

  const { data: byId } = await supabase
    .from("products")
    .select("id")
    .eq("id", slugOrId)
    .maybeSingle();

  return byId?.id ?? null;
}

export async function createPendingOrder(input: {
  userId: string | null;
  customer: CustomerDetails;
  orderType: "cart" | "coffret" | "packaging";
  totalCents: number;
  items: CheckoutItem[];
  customMessage?: string | null;
  hidePrice?: boolean;
  boxSizeId?: string | null;
  boxThemeId?: string | null;
}): Promise<{ orderId: string } | { error: string }> {
  const supabase = createAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: input.userId,
      status: "pending",
      total_cents: input.totalCents,
      order_type: input.orderType,
      customer_name: input.customer.fullName,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
      delivery_address: input.customer.address,
      delivery_city: input.customer.city,
      delivery_notes: input.customer.notes ?? null,
      custom_message: input.customMessage ?? null,
      hide_price: input.hidePrice ?? false,
      box_size_id: input.boxSizeId ?? null,
      box_theme_id: input.boxThemeId ?? null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Impossible de créer la commande" };
  }

  const orderItems = await Promise.all(
    input.items.map(async (item) => {
      const isPackaging = item.kind === "packaging" || item.id.startsWith("packaging:");
      const productId = isPackaging ? null : await resolveProductId(item.id);

      return {
        order_id: order.id,
        product_id: productId,
        item_name: item.name,
        item_kind: (isPackaging ? "packaging" : "product") as "packaging" | "product",
        quantity: item.quantity,
        unit_price_cents: item.priceCents,
      };
    }),
  );

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: itemsError.message };
  }

  return { orderId: order.id };
}

export async function markOrderPaid(
  orderId: string,
  stripeSessionId: string,
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from("orders")
    .update({ status: "paid", stripe_session_id: stripeSessionId })
    .eq("id", orderId);
}

export async function getOrderByIdAdmin(orderId: string): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) return null;
  return data as OrderWithItems;
}

export async function getAllOrdersAdmin(): Promise<OrderWithItems[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OrderWithItems[];
}

export async function getUserOrdersClient(userId: string): Promise<OrderWithItems[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OrderWithItems[];
}
