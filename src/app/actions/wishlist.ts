"use server";

import { revalidatePath } from "next/cache";

import { api } from "@/lib/api";
import type { Wishlist, WishlistItem } from "@/lib/types";

type Result<T> = { data?: T; error?: string };

const BASE = "/api/users/me/wishlists";

async function run<T>(request: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await request();
    revalidatePath("/cuenta/favoritos");
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se ha podido guardar el cambio." };
  }
}

export async function createWishlist(name: string) {
  return run(() => api<Wishlist>(`${BASE}/`, { method: "POST", auth: true, body: { name } }));
}

export async function renameWishlist(listId: number, name: string) {
  return run(() =>
    api<Wishlist>(`${BASE}/${listId}/`, { method: "PATCH", auth: true, body: { name } }),
  );
}

export async function deleteWishlist(listId: number) {
  return run(() => api<void>(`${BASE}/${listId}/`, { method: "DELETE", auth: true }));
}

export async function addToWishlist(listId: number, productId: number) {
  return run(() =>
    api<WishlistItem>(`${BASE}/${listId}/items/`, {
      method: "POST",
      auth: true,
      body: { product_id: productId },
    }),
  );
}

export async function removeFromWishlist(listId: number, itemId: number) {
  return run(() =>
    api<void>(`${BASE}/${listId}/items/${itemId}/`, { method: "DELETE", auth: true }),
  );
}
