import type { Metadata } from "next";

import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Carrito" };

export default function CartPage() {
  return (
    <div className="container-page pt-12">
      <h1 className="mb-10 font-display text-4xl font-bold tracking-tight sm:text-5xl">Tu carrito</h1>
      <CartView />
    </div>
  );
}
