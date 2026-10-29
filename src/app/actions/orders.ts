"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { api } from "@/lib/api";
import type { CheckoutSession, Order } from "@/lib/types";

import type { FormState } from "./auth";

export async function placeOrder(_: FormState, formData: FormData): Promise<FormState> {
  let items: { variant_id: number; quantity: number }[];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "El carrito no es válido." };
  }
  if (!items.length) return { error: "Tu carrito está vacío." };

  const field = (name: string) => String(formData.get(name) ?? "").trim();

  let order: Order;
  try {
    order = await api<Order>("/api/orders/", {
      method: "POST",
      auth: true,
      body: {
        items,
        shipping_name: field("shipping_name"),
        shipping_address: field("shipping_address"),
        shipping_city: field("shipping_city"),
        shipping_postal_code: field("shipping_postal_code"),
        shipping_province: field("shipping_province"),
        shipping_country: field("shipping_country") || "ES",
        shipping_phone: field("shipping_phone"),
        notes: field("notes"),
      },
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se ha podido crear el pedido." };
  }

  redirect(`/cuenta/pedidos/${order.number}?pagar=1`);
}

export async function startCheckout(
  orderNumber: string,
): Promise<{ session?: CheckoutSession; error?: string }> {
  try {
    const session = await api<CheckoutSession>("/api/payments/checkout/", {
      method: "POST",
      auth: true,
      body: { order_number: orderNumber },
    });
    return { session };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se ha podido iniciar el pago." };
  }
}

export async function cancelOrder(orderNumber: string) {
  await api(`/api/orders/${encodeURIComponent(orderNumber)}/cancel/`, {
    method: "POST",
    auth: true,
  });
  revalidatePath(`/cuenta/pedidos/${orderNumber}`);
}
