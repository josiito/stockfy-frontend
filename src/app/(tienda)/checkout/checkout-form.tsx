"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { placeOrder } from "@/app/actions/orders";
import { useCart } from "@/components/cart/cart-provider";
import { FormError } from "@/components/form-error";
import { formatPrice } from "@/lib/format";

type Props = { defaults: { name: string; phone: string } };

export function CheckoutForm({ defaults }: Props) {
  const { items, subtotal, ready } = useCart();
  const [state, action, pending] = useActionState(placeOrder, undefined);

  if (!ready) return <div className="card h-96 animate-pulse" />;

  if (!items.length) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-xl font-semibold">No hay nada que pedir todavía</p>
        <Link href="/productos" className="btn-primary mt-6">Ir al catálogo</Link>
      </div>
    );
  }

  const payload = JSON.stringify(items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })));

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="items" value={payload} />

      <section className="card space-y-5 p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">Datos de envío</h2>
        <Field name="shipping_name" label="Nombre completo" defaultValue={defaults.name} required autoComplete="name" />
        <Field name="shipping_address" label="Dirección" required autoComplete="street-address" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="shipping_city" label="Ciudad" required autoComplete="address-level2" />
          <Field name="shipping_postal_code" label="Código postal" required autoComplete="postal-code" />
          <Field name="shipping_province" label="Provincia" autoComplete="address-level1" />
          <Field name="shipping_phone" label="Teléfono" defaultValue={defaults.phone} type="tel" autoComplete="tel" />
        </div>
        <input type="hidden" name="shipping_country" value="ES" />
        <div>
          <label className="label" htmlFor="notes">Notas para el pedido (opcional)</label>
          <textarea id="notes" name="notes" rows={3} className="input" />
        </div>
      </section>

      <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold">Tu pedido</h2>
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between gap-4">
              <span>
                {item.quantity} × {item.productName}
                {item.variantLabel && <span className="block text-ink-muted">{item.variantLabel}</span>}
              </span>
              <span className="font-medium">{formatPrice(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-line pt-4">
          <span className="font-semibold">Subtotal</span>
          <span className="font-display text-xl font-bold">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-ink-muted">Los gastos de envío se añaden al confirmar el pedido.</p>
        <FormError message={state?.error} />
        <button className="btn-accent w-full py-3.5 text-base" disabled={pending}>
          <Lock className="size-4" /> {pending ? "Creando pedido…" : "Confirmar y pagar"}
        </button>
      </aside>
    </form>
  );
}

function Field({ name, label, ...props }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" {...props} />
    </div>
  );
}
