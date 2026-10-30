import { ArrowRight, Boxes, PackageCheck, PackageX, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { PageHeader } from "@/components/panel/page-header";
import { StockBadge } from "@/components/panel/status-badge";
import { getAdminProducts, getLowStockVariants, getRecentMovements } from "@/lib/admin-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { MOVEMENT_LABELS } from "@/lib/labels";
import type { Paginated } from "@/lib/types";

export const metadata: Metadata = { title: { absolute: "Resumen · Panel Stockfy" } };

async function Stats() {
  let stats;
  try {
    const [all, active, outOfStock] = await Promise.all([
      getAdminProducts(),
      getAdminProducts({ status: "ACTIVE" }),
      api<Paginated<unknown>>("/api/admin/variants/", {
        auth: true,
        query: { status: "ACTIVE", available: false },
      }),
    ]);
    stats = [
      { label: "Productos", value: all.count, icon: Boxes, tone: "bg-info-soft text-info" },
      { label: "Activos en la tienda", value: active.count, icon: PackageCheck, tone: "bg-brand-soft text-brand" },
      { label: "Variantes sin stock", value: outOfStock.count, icon: PackageX, tone: "bg-accent-soft text-accent" },
    ];
  } catch {
    return <ApiUnavailable />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="card flex items-center gap-4 p-5">
          <span className={`grid size-12 place-items-center rounded-2xl ${tone}`}>
            <Icon className="size-6" />
          </span>
          <div>
            <p className="font-display text-3xl font-medium">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

async function LowStock() {
  let variants;
  try {
    variants = (await getLowStockVariants()).results.filter((v) => v.stock <= 3).slice(0, 8);
  } catch {
    return <ApiUnavailable />;
  }

  if (!variants.length) {
    return <p className="card p-6 text-sm text-ink-muted">Todas las variantes activas tienen más de 3 unidades.</p>;
  }

  return (
    <ul className="card divide-y divide-line">
      {variants.map((v) => (
        <li key={v.id}>
          <Link href={`/panel/productos/${v.product}#variantes`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-surface-muted/60">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{v.product_name}</p>
              <p className="font-mono text-xs text-ink-muted">{v.sku}</p>
            </div>
            <StockBadge stock={v.stock} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function Movements() {
  let movements;
  try {
    movements = (await getRecentMovements()).results.slice(0, 8);
  } catch {
    return <ApiUnavailable />;
  }

  if (!movements.length) {
    return <p className="card p-6 text-sm text-ink-muted">Todavía no hay movimientos de stock.</p>;
  }

  return (
    <ul className="card divide-y divide-line">
      {movements.map((m) => (
        <li key={m.id} className="flex items-center gap-4 px-5 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {MOVEMENT_LABELS[m.movement_type]} · <span className="font-mono">{m.sku}</span>
            </p>
            <p className="truncate text-xs text-ink-muted">
              {formatDate(m.created_at)}
              {m.user_email && ` · ${m.user_email}`}
              {m.reason && ` · ${m.reason}`}
            </p>
          </div>
          <span className={`font-mono text-sm font-semibold ${m.quantity > 0 ? "text-brand" : "text-danger"}`}>
            {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function PanelHome() {
  return (
    <>
      <PageHeader
        title="Resumen"
        subtitle="Estado del catálogo y últimos movimientos de stock."
        actions={
          <Link href="/panel/productos/nuevo" className="btn-primary">
            <Plus className="size-4" /> Nuevo producto
          </Link>
        }
      />

      <Suspense fallback={<div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="card h-24 animate-pulse" />)}</div>}>
        <Stats />
      </Suspense>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-medium">Poco stock</h2>
            <Link href="/panel/productos" className="flex items-center gap-1 text-sm font-medium text-brand hover:underline">
              Ver productos <ArrowRight className="size-4" />
            </Link>
          </div>
          <Suspense fallback={<div className="card h-64 animate-pulse" />}>
            <LowStock />
          </Suspense>
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl font-medium">Últimos movimientos</h2>
          <Suspense fallback={<div className="card h-64 animate-pulse" />}>
            <Movements />
          </Suspense>
        </section>
      </div>
    </>
  );
}
