import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { OrderStatusBadge } from "@/components/order-status";
import { getCurrentUser, getOrders } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Mi cuenta" };

async function Greeting() {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="border-b border-line pb-8">
      <p className="eyebrow">Mi cuenta</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        Hola{user?.first_name ? `, ${user.first_name}` : ""}
      </h1>
      {user && <p className="mt-2 text-ink-muted">{user.email}</p>}
    </div>
  );
}

async function Orders() {
  let orders;
  try {
    orders = await getOrders();
  } catch {
    return <ApiUnavailable />;
  }

  if (!orders.results.length) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-xl font-medium">Aún no has hecho ningún pedido</p>
        <Link href="/productos" className="btn-primary mt-6">Empezar a comprar</Link>
      </div>
    );
  }

  return (
    <ul className="card divide-y divide-line">
      {orders.results.map((order) => (
        <li key={order.id}>
          <Link href={`/cuenta/pedidos/${order.number}`} className="flex items-center gap-4 p-5 transition hover:bg-surface-muted/60">
            <div className="flex-1">
              <p className="font-semibold">Pedido {order.number}</p>
              <p className="text-sm text-ink-muted">
                {formatDate(order.created_at)} · {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
              </p>
            </div>
            <OrderStatusBadge status={order.status} label={order.status_display} />
            <span className="w-24 text-right font-semibold">{formatPrice(order.total)}</span>
            <ChevronRight className="size-4 text-ink-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<div className="h-28 animate-pulse rounded-lg bg-surface-muted" />}>
        <Greeting />
      </Suspense>
      <section>
        <h2 className="mb-4 font-display text-2xl">Mis pedidos</h2>
        <Suspense fallback={<div className="card h-48 animate-pulse" />}>
          <Orders />
        </Suspense>
      </section>
    </div>
  );
}
