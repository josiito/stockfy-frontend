"use client";

import { useActionState, useState } from "react";

import { saveProduct } from "@/app/panel/actions/products";
import { FormError } from "@/components/form-error";
import type { AdminCategory, AdminProduct } from "@/lib/types";

import { FormSuccess } from "./form-success";
import { PRODUCT_STATUS } from "./status-badge";

export function ProductForm({ product, categories }: { product?: AdminProduct; categories: AdminCategory[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [name, setName] = useState(product?.name ?? "");

  return (
    <form action={action} className="card space-y-5 p-6">
      {product && <input type="hidden" name="product_id" value={product.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Nombre</label>
          <input id="name" name="name" required maxLength={255} value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder={product ? undefined : "Se genera a partir del nombre"}
            className="input font-mono"
          />
        </div>
        <div>
          <label className="label" htmlFor="category">Categoría</label>
          <select id="category" name="category" required defaultValue={product?.category ?? ""} className="input">
            <option value="" disabled>Elige una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.is_active ? "" : " (inactiva)"}
              </option>
            ))}
          </select>
          {product && (
            <p className="mt-1.5 text-xs text-ink-muted">
              Si cambias la categoría, las variantes deben usar los atributos de la nueva.
            </p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={product?.status ?? "DRAFT"} className="input">
            {Object.entries(PRODUCT_STATUS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink-muted">Solo los productos activos se ven en la tienda.</p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="short_description">Descripción corta</label>
        <input id="short_description" name="short_description" maxLength={500} defaultValue={product?.short_description} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="description">Descripción</label>
        <textarea id="description" name="description" rows={6} defaultValue={product?.description} className="input" />
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-[var(--brand)]" />
        Destacado en la tienda
      </label>

      <FormError message={state?.error} />
      <FormSuccess message={state?.ok} />

      <div className="flex justify-end">
        <button className="btn-primary" disabled={pending}>
          {pending ? "Guardando…" : product ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
