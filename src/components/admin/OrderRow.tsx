import { formatPrice } from "@/lib/utils/format";
import type { OrderWithItems } from "@/lib/supabase/orders";
import {
  buildCustomerWhatsAppUrl,
  buildOrderCustomerWhatsAppMessage,
} from "@/lib/whatsapp/customer-chat-url";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  preparing: "En préparation",
  ready: "Prête",
  cancelled: "Annulée",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  cart: "Panier",
  coffret: "Coffret",
  packaging: "Packaging",
};

function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-CI", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface OrderRowProps {
  order: OrderWithItems;
  siteName?: string;
}

export function OrderRow({ order, siteName }: OrderRowProps) {
  const statusLabel = STATUS_LABELS[order.status] ?? order.status;
  const typeLabel = ORDER_TYPE_LABELS[order.order_type] ?? order.order_type;
  const whatsAppUrl = order.customer_phone
    ? buildCustomerWhatsAppUrl(
        order.customer_phone,
        buildOrderCustomerWhatsAppMessage({
          customerName: order.customer_name,
          orderRef: order.id.slice(0, 8),
          totalLabel: formatPrice(order.total_cents),
          siteName,
        }),
      )
    : null;

  return (
    <article className="rounded-card border border-outline-variant/40 bg-surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-headline-sm text-secondary">
              {order.customer_name ?? "Client inconnu"}
            </span>
            <span className="rounded-full bg-primary-container px-3 py-0.5 font-body text-label-sm text-on-primary-container">
              {statusLabel}
            </span>
            <span className="rounded-full bg-surface-container px-3 py-0.5 font-body text-label-sm text-on-surface-variant">
              {typeLabel}
            </span>
          </div>

          <p className="font-body text-label-sm text-on-surface-variant">
            {formatOrderDate(order.created_at)}
            {order.stripe_session_id ? (
              <span className="ml-2 opacity-70">· Stripe OK</span>
            ) : null}
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <p className="font-body text-body-md">
              <span className="text-on-surface-variant">Tél. </span>
              {order.customer_phone ? (
                <a href={`tel:${order.customer_phone}`} className="text-primary hover:underline">
                  {order.customer_phone}
                </a>
              ) : (
                "—"
              )}
            </p>
            <p className="font-body text-body-md">
              <span className="text-on-surface-variant">Email </span>
              {order.customer_email ? (
                <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">
                  {order.customer_email}
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>

          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="font-body text-label-md text-secondary">Adresse de livraison</p>
            <p className="mt-1 font-body text-body-md">
              {order.delivery_address ?? "—"}
              {order.delivery_city ? `, ${order.delivery_city}` : ""}
            </p>
            {order.delivery_notes ? (
              <p className="mt-1 font-body text-label-sm text-on-surface-variant">
                Note : {order.delivery_notes}
              </p>
            ) : null}
          </div>

          {order.custom_message ? (
            <p className="font-body text-label-sm text-on-surface-variant">
              Message coffret : « {order.custom_message} »
              {order.hide_price ? " · Prix masqué" : ""}
            </p>
          ) : null}

          {whatsAppUrl ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 font-body text-label-md text-white transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon />
              Contacter sur WhatsApp
            </a>
          ) : null}
        </div>

        <div className="w-full shrink-0 lg:w-72">
          <p className="mb-2 font-body text-label-md text-secondary">Contenu</p>
          <ul className="space-y-1 border-t border-outline-variant/40 pt-2">
            {order.order_items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between gap-2 font-body text-label-sm"
              >
                <span className="min-w-0 truncate">
                  {item.quantity}× {item.item_name ?? "Article"}
                  {item.item_kind === "packaging" ? " (packaging)" : ""}
                </span>
                <span className="shrink-0 text-on-surface-variant">
                  {formatPrice(item.unit_price_cents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-outline-variant/40 pt-2 font-display text-headline-sm text-primary">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
