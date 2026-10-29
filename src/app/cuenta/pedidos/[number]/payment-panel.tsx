"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

import { startCheckout } from "@/app/actions/orders";
import { useCart } from "@/components/cart/cart-provider";
import { FormError } from "@/components/form-error";
import { formatPrice } from "@/lib/format";
import type { CheckoutSession } from "@/lib/types";

type Props = { orderNumber: string; total: string; clearCart: boolean };

/** Envía el formulario POST que piden pasarelas como Redsys. */
function submitRedirectForm(url: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export function PaymentPanel({ orderNumber, total, clearCart }: Props) {
  const cart = useCart();
  const [session, setSession] = useState<CheckoutSession>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  // Recién creado el pedido: el carrito ya está en el backend.
  const { clear, ready } = cart;
  useEffect(() => {
    if (clearCart && ready) clear();
  }, [clearCart, ready, clear]);

  function pay() {
    setError(undefined);
    startTransition(async () => {
      const result = await startCheckout(orderNumber);
      if (result.error || !result.session) {
        setError(result.error);
        return;
      }
      const s = result.session;
      if (s.redirect_url) {
        if (Object.keys(s.form_fields ?? {}).length) submitRedirectForm(s.redirect_url, s.form_fields);
        else window.location.href = s.redirect_url;
        return;
      }
      setSession(s);
    });
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-accent-soft p-6">
        <div>
          <p className="font-display text-lg font-semibold text-accent-strong">Pendiente de pago</p>
          <p className="text-sm text-ink-muted">Completa el pago para que empecemos a preparar tu pedido.</p>
        </div>
        {!session && (
          <button type="button" onClick={pay} disabled={pending} className="btn-accent">
            <CreditCard className="size-4" /> {pending ? "Conectando…" : `Pagar ${formatPrice(total)}`}
          </button>
        )}
      </div>

      {(error || session) && (
        <div className="space-y-4 p-6">
          <FormError message={error} />
          {session?.client_secret && session.public_key ? (
            <StripePayment session={session} orderNumber={orderNumber} />
          ) : session ? (
            <p className="text-sm text-ink-muted">
              Pago iniciado con la pasarela <strong>{session.provider}</strong> (referencia{" "}
              <code>{session.reference}</code>). El pedido se marcará como pagado cuando la pasarela lo confirme.
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

function StripePayment({ session, orderNumber }: { session: CheckoutSession; orderNumber: string }) {
  const stripePromise = useMemo<Promise<Stripe | null>>(() => loadStripe(session.public_key!), [session.public_key]);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: session.client_secret!,
        appearance: {
          theme: "stripe",
          variables: { colorPrimary: "#11795a", borderRadius: "12px", fontFamily: "inherit" },
        },
      }}
    >
      <StripeForm orderNumber={orderNumber} />
    </Elements>
  );
}

function StripeForm({ orderNumber }: { orderNumber: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/cuenta/pedidos/${orderNumber}` },
    });
    // Solo se llega aquí si hay error: si no, Stripe redirige a return_url.
    setError(error?.message);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <FormError message={error} />
      <button className="btn-primary w-full py-3.5" disabled={!stripe || submitting}>
        {submitting ? "Procesando…" : "Confirmar pago"}
      </button>
    </form>
  );
}
