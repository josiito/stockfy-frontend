"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, ready, setQuantity, remove } = useCart();

  if (!ready) return <div className="card h-64 animate-pulse" />;

  if (!items.length) {
    return (
      <div className="card flex flex-col items-center p-14 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent-soft text-accent">
          <ShoppingBag className="size-7" />
        </span>
        <p className="mt-6 font-display text-2xl font-medium">Tu carrito está vacío</p>
        <p className="mt-2 text-ink-muted">Descubre nuestras piezas artesanales.</p>
        <Link href="/productos" className="btn-primary mt-8">
          Ir al catálogo <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.variantId} className="card flex gap-4 p-4 sm:gap-6">
            <Link href={`/productos/${item.productSlug}`} className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-surface-muted sm:size-28">
              {item.image ? (
                <Image src={item.image} alt={item.productName} fill sizes="112px" className="object-cover" />
              ) : (
                <ImagePlaceholder seed={item.variantId} />
              )}
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/productos/${item.productSlug}`} className="font-display text-lg font-medium hover:text-brand">
                    {item.productName}
                  </Link>
                  {item.variantLabel && <p className="text-sm text-ink-muted">{item.variantLabel}</p>}
                </div>
                <p className="font-semibold">{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-line">
                  <button type="button" className="grid size-9 place-items-center" aria-label="Quitar uno" onClick={() => setQuantity(item.variantId, item.quantity - 1)}>
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                  <button type="button" className="grid size-9 place-items-center" aria-label="Añadir uno" onClick={() => setQuantity(item.variantId, item.quantity + 1)}>
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button type="button" onClick={() => remove(item.variantId)} className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-danger">
                  <Trash2 className="size-4" /> Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-medium">Resumen</h2>
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Envío</span>
          <span className="text-ink-muted">Se calcula al pedir</span>
        </div>
        <Link href="/checkout" className="btn-accent w-full py-3.5 text-base">
          Tramitar pedido <ArrowRight className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
