"use client";

import { ChevronDown, PackagePlus, Plus } from "lucide-react";
import { useActionState, useId } from "react";

import { adjustStock, createVariant, discontinueVariant, updateVariant } from "@/app/panel/actions/products";
import { FormError } from "@/components/form-error";
import { formatPrice } from "@/lib/format";
import { MOVEMENT_LABELS } from "@/lib/labels";
import type { AdminVariant, CategoryAttribute, MovementType } from "@/lib/types";

import { ConfirmForm } from "./confirm-form";
import { FormSuccess } from "./form-success";
import { Badge, StockBadge, VARIANT_STATUS } from "./status-badge";

type Props = {
  productId: number;
  variants: AdminVariant[];
  attributes: CategoryAttribute[];
};

const ADJUST_TYPES: MovementType[] = ["STOCK_IN", "SALE_STORE", "RETURN", "DAMAGED", "CORRECTION"];

function describe(variant: AdminVariant, attributes: CategoryAttribute[]) {
  const labels = attributes.flatMap((attr) =>
    attr.values.filter((v) => variant.attributes.includes(v.id)).map((v) => `${attr.name}: ${v.value}`),
  );
  return labels.join(" · ") || "Sin atributos";
}

function VariantFields({ variant, attributes }: { variant?: AdminVariant; attributes: CategoryAttribute[] }) {
  const id = useId();
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label" htmlFor={`${id}-sku`}>SKU</label>
          <input id={`${id}-sku`} name="sku" required maxLength={100} defaultValue={variant?.sku} className="input font-mono uppercase" />
        </div>
        <div>
          <label className="label" htmlFor={`${id}-price`}>Precio (€)</label>
          <input id={`${id}-price`} name="price" type="number" step="0.01" min="0" required defaultValue={variant?.price} className="input" />
        </div>
        <div>
          <label className="label" htmlFor={`${id}-compare_at_price`}>Precio anterior (€)</label>
          <input id={`${id}-compare_at_price`} name="compare_at_price" type="number" step="0.01" min="0" defaultValue={variant?.compare_at_price ?? ""} placeholder="Opcional" className="input" />
        </div>
        <div>
          <label className="label" htmlFor={`${id}-status`}>Estado</label>
          <select id={`${id}-status`} name="status" defaultValue={variant?.status ?? "ACTIVE"} className="input">
            {Object.entries(VARIANT_STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {attributes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attributes.map((attr) => (
            <div key={attr.id}>
              <label className="label" htmlFor={`${id}-attr-${attr.id}`}>
                {attr.name}
                {attr.required && <span className="text-danger"> *</span>}
              </label>
              <select
                id={`${id}-attr-${attr.id}`}
                name={`attr_${attr.id}`}
                required={attr.required}
                defaultValue={attr.values.find((v) => variant?.attributes.includes(v.id))?.id ?? ""}
                className="input"
              >
                <option value="">{attr.required ? "Elige…" : "Sin valor"}</option>
                {attr.values.map((v) => (
                  <option key={v.id} value={v.id}>{v.value}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function NewVariant({ productId, attributes }: { productId: number; attributes: CategoryAttribute[] }) {
  const [state, action, pending] = useActionState(createVariant, undefined);

  return (
    <details className="card group p-5" open={false}>
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold">
        <Plus className="size-4 text-brand" /> Añadir variante
        <ChevronDown className="ml-auto size-4 text-ink-muted transition group-open:rotate-180" />
      </summary>
      <form action={action} className="mt-5 space-y-4">
        <input type="hidden" name="product_id" value={productId} />
        <VariantFields attributes={attributes} />
        <FormError message={state?.error} />
        <FormSuccess message={state?.ok} />
        <div className="flex justify-end">
          <button className="btn-primary" disabled={pending}>{pending ? "Creando…" : "Crear variante"}</button>
        </div>
      </form>
    </details>
  );
}

function StockForm({ productId, variant }: { productId: number; variant: AdminVariant }) {
  const [state, action, pending] = useActionState(adjustStock, undefined);

  return (
    <form action={action} className="space-y-3 rounded-2xl bg-surface-muted/60 p-4">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="variant_id" value={variant.id} />
      <p className="flex items-center gap-2 text-sm font-semibold">
        <PackagePlus className="size-4 text-brand" /> Ajustar stock
      </p>
      <div className="grid gap-3 sm:grid-cols-[180px_120px_1fr_auto]">
        <select name="movement_type" defaultValue="STOCK_IN" className="input" aria-label="Tipo de movimiento">
          {ADJUST_TYPES.map((type) => (
            <option key={type} value={type}>{MOVEMENT_LABELS[type]}</option>
          ))}
        </select>
        <input name="quantity" type="number" step="1" required placeholder="Unidades" className="input" aria-label="Unidades" />
        <input name="reason" maxLength={255} placeholder="Motivo (opcional)" className="input" aria-label="Motivo" />
        <button className="btn-ghost" disabled={pending}>{pending ? "…" : "Aplicar"}</button>
      </div>
      <p className="text-xs text-ink-muted">
        Ventas y daños restan las unidades indicadas. En «Corrección» usa un número negativo para restar.
      </p>
      <FormError message={state?.error} />
      <FormSuccess message={state?.ok} />
    </form>
  );
}

function VariantRow({ productId, variant, attributes }: { productId: number; variant: AdminVariant; attributes: CategoryAttribute[] }) {
  const [state, action, pending] = useActionState(updateVariant, undefined);
  const status = VARIANT_STATUS[variant.status];

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition hover:bg-surface-muted/60">
        <span className="font-mono text-sm font-semibold">{variant.sku}</span>
        <span className="min-w-0 flex-1 truncate text-sm text-ink-muted">{describe(variant, attributes)}</span>
        <Badge tone={status.tone}>{status.label}</Badge>
        <span className="w-24 text-right font-semibold">{formatPrice(variant.price)}</span>
        <StockBadge stock={variant.stock} />
        <ChevronDown className="size-4 text-ink-muted transition group-open:rotate-180" />
      </summary>

      <div className="space-y-4 border-t border-line px-5 py-5">
        <StockForm productId={productId} variant={variant} />

        <form action={action} className="space-y-4">
          <input type="hidden" name="product_id" value={productId} />
          <input type="hidden" name="variant_id" value={variant.id} />
          <VariantFields variant={variant} attributes={attributes} />
          <FormError message={state?.error} />
          <FormSuccess message={state?.ok} />
          <div className="flex flex-wrap justify-end gap-2">
            <button className="btn-primary" disabled={pending}>{pending ? "Guardando…" : "Guardar variante"}</button>
          </div>
        </form>

        {variant.status !== "DISCONTINUED" && (
          <div className="flex justify-end">
            <ConfirmForm
              action={discontinueVariant}
              fields={{ product_id: productId, variant_id: variant.id }}
              confirm={`¿Descatalogar la variante ${variant.sku}? Dejará de venderse, pero se conserva su histórico.`}
              className="btn-ghost text-danger hover:border-danger hover:text-danger"
            >
              Descatalogar
            </ConfirmForm>
          </div>
        )}
      </div>
    </details>
  );
}

export function VariantManager({ productId, variants, attributes }: Props) {
  return (
    <div className="space-y-4">
      {variants.length ? (
        <div className="card divide-y divide-line overflow-hidden">
          {variants.map((variant) => (
            <VariantRow key={variant.id} productId={productId} variant={variant} attributes={attributes} />
          ))}
        </div>
      ) : (
        <p className="card p-6 text-sm text-ink-muted">
          Este producto aún no tiene variantes. Sin variantes activas no se puede comprar en la tienda.
        </p>
      )}
      <NewVariant productId={productId} attributes={attributes} />
    </div>
  );
}
