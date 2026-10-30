import type { Metadata } from "next";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/api";

import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Finalizar pedido" };

async function CheckoutWithUser() {
  const user = await getCurrentUser().catch(() => null);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  return <CheckoutForm defaults={{ name, phone: user?.phone ?? "" }} />;
}

export default function CheckoutPage() {
  return (
    <div className="container-page pt-12">
      <h1 className="mb-10 font-display text-4xl font-medium tracking-tight sm:text-5xl">Finalizar pedido</h1>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <CheckoutWithUser />
      </Suspense>
    </div>
  );
}
