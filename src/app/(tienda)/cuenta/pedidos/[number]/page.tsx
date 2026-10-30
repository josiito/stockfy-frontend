import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { cancelOrder } from "@/app/actions/orders";
import { ApiUnavailable } from "@/components/api-error";
import { OrderStatusBadge } from "@/components/order-status";
import { ApiError, getOrder } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

import { PaymentPanel } from "./payment-panel";

async function OrderView({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { number } = await params;
  const query = await searchParams;

  let order;
  try {
    order = await getOrder(number);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ApiUnavailable />;
  }

  const pending = order.status === "PENDING_PAYMENT";
  // Stripe vuelve aquí con ?redirect_status=succeeded mientras llega el webhook.
  const returning = query.redirect_status === "succeeded";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Pedido {order.number}</h1>
          <p className="text-sm text-ink-muted">Realizado el {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} label={order.status_display} />
      </div>

      {pending && returning && (
        <p className="rounded-2xl bg-info-soft p-4 text-sm text-info-strong">
          Hemos recibido tu pago. Estamos esperando la confirmación de la pasarela; recarga en unos segundos.
        </p>
      )}
      {pending && !returning && (
        <PaymentPanel orderNumber={order.number} total={order.total} clearCart={query.pagar === "1"} />
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Artículos</h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  <span className="font-medium">{item.quantity} × {item.product_name}</span>
                  {item.variant_description && <span className="block text-ink-muted">{item.variant_description}</span>}
                </span>
                <span className="font-medium">{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Envío</dt><dd>{formatPrice(order.shipping_cost)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="font-display text-xl">{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <section className="card h-fit space-y-2 p-6 text-sm">
          <h2 className="mb-2 font-display text-lg font-semibold">Envío</h2>
          <p className="font-medium">{order.shipping_name}</p>
          <p className="text-ink-muted">
            {order.shipping_address}<br />
            {order.shipping_postal_code} {order.shipping_city}
            {order.shipping_province && `, ${order.shipping_province}`}
          </p>
          {order.shipping_phone && <p className="text-ink-muted">{order.shipping_phone}</p>}
          {pending && (
            <form action={cancelOrder.bind(null, order.number)} className="pt-4">
              <button className="text-sm font-medium text-danger hover:underline">Cancelar pedido</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export async function generateMetadata(props: PageProps<"/cuenta/pedidos/[number]">): Promise<Metadata> {
  const { number } = await props.params;
  return { title: `Pedido ${number}` };
}

export default function OrderPage(props: PageProps<"/cuenta/pedidos/[number]">) {
  return (
    <div>
      <Link href="/cuenta" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-ink-muted hover:text-brand">
        <ChevronLeft className="size-4" /> Mis pedidos
      </Link>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <OrderView params={props.params} searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
