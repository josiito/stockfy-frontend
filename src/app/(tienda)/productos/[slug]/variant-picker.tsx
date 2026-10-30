"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import type { ProductDetail } from "@/lib/types";

type Props = {
  product: ProductDetail;
  image: string | null;
  /** Botón de favoritos; lo pinta el servidor porque depende de la sesión. */
  wishlistSlot?: React.ReactNode;
};

export function VariantPicker({ product, image, wishlistSlot }: Props) {
  const variants = product.variants.filter((v) => !v.status || v.status === "ACTIVE");
  const { add } = useCart();

  // Atributos disponibles (medida, color...) con sus valores, en orden de aparición.
  const attributes = useMemo(() => {
    const map = new Map<number, { name: string; values: Map<number, string> }>();
    for (const variant of variants) {
      for (const attr of variant.attributes) {
        if (!map.has(attr.attribute_id)) {
          map.set(attr.attribute_id, { name: attr.attribute, values: new Map() });
        }
        map.get(attr.attribute_id)!.values.set(attr.value_id, attr.value);
      }
    }
    return [...map.entries()];
  }, [variants]);

  const initial = variants.find((v) => (v.stock ?? 0) > 0) ?? variants[0];
  const [selection, setSelection] = useState<Record<number, number>>(() =>
    Object.fromEntries(initial?.attributes.map((a) => [a.attribute_id, a.value_id]) ?? []),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) =>
    v.attributes.every((a) => selection[a.attribute_id] === a.value_id),
  );
  const stock = variant?.stock ?? 0;

  /** ¿Existe alguna variante con este valor y el resto de la selección actual? */
  function isAvailable(attributeId: number, valueId: number) {
    return variants.some(
      (v) =>
        v.attributes.some((a) => a.attribute_id === attributeId && a.value_id === valueId) &&
        v.attributes.every(
          (a) => a.attribute_id === attributeId || selection[a.attribute_id] === a.value_id,
        ),
    );
  }

  function handleAdd() {
    if (!variant) return;
    add(
      {
        variantId: variant.id,
        productSlug: product.slug,
        productName: product.name,
        variantLabel: variant.attributes.map((a) => a.value).join(" · "),
        price: variant.price,
        image,
        maxQuantity: stock,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  if (!variants.length) {
    return <p className="rounded-2xl bg-surface-muted p-4 text-sm">Este producto no está a la venta ahora mismo.</p>;
  }

  return (
    <div className="space-y-7">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl font-medium">{formatPrice(variant?.price)}</span>
        {variant?.compare_at_price && Number(variant.compare_at_price) > Number(variant.price) && (
          <span className="text-lg text-ink-muted line-through">{formatPrice(variant.compare_at_price)}</span>
        )}
      </div>

      {attributes.map(([attributeId, { name, values }]) => (
        <fieldset key={attributeId}>
          <legend className="label">{name}</legend>
          <div className="flex flex-wrap gap-2">
            {[...values.entries()].map(([valueId, value]) => {
              const active = selection[attributeId] === valueId;
              const available = isAvailable(attributeId, valueId);
              return (
                <button
                  key={valueId}
                  type="button"
                  onClick={() => setSelection((s) => ({ ...s, [attributeId]: valueId }))}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-brand-fill bg-brand-fill text-white"
                      : "border-line bg-surface hover:border-ink"
                  } ${available ? "" : "opacity-40"}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <p className="text-sm">
        {!variant ? (
          <span className="text-danger">Esta combinación no está disponible.</span>
        ) : stock > 0 ? (
          <span className="inline-flex items-center gap-2 text-brand">
            <span className="size-2 rounded-full bg-brand-fill" />
            {stock > 5 ? "En stock" : `¡Solo quedan ${stock}!`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-accent">
            <span className="size-2 rounded-full bg-accent-fill" /> Agotado
          </span>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-md border border-line bg-surface">
          <button type="button" className="grid size-11 place-items-center" aria-label="Quitar uno" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button type="button" className="grid size-11 place-items-center" aria-label="Añadir uno" onClick={() => setQuantity((q) => Math.min(Math.max(stock, 1), q + 1))}>
            <Plus className="size-4" />
          </button>
        </div>
        <button type="button" onClick={handleAdd} disabled={!variant || stock < 1} className="btn-primary min-w-48 flex-1 whitespace-nowrap py-3.5 text-base">
          {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
          {added ? "Añadido" : "Añadir al carrito"}
        </button>
        {wishlistSlot}
      </div>

      {added && (
        <Link href="/carrito" className="block text-sm font-semibold text-brand hover:underline">
          Ver carrito →
        </Link>
      )}

      {variant && <p className="text-xs text-ink-muted">Ref. {variant.sku}</p>}
    </div>
  );
}
