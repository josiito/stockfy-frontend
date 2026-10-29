"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCart } from "./cart-provider";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative grid size-11 place-items-center rounded-full border border-line bg-surface transition hover:border-brand hover:text-brand"
      aria-label={`Carrito, ${count} artículos`}
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent-fill px-1.5 text-[11px] font-bold leading-5 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
