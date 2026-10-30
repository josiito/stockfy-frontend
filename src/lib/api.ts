import "server-only";

import { cache } from "react";

import { getAccessToken } from "./session";
import type {
  Category,
  Order,
  Paginated,
  Product,
  ProductDetail,
  User,
  Wishlist,
} from "./types";

export const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(extractMessage(data) ?? `Error ${status} en la API`);
  }
}

/** Convierte los errores de DRF ({"detail": ...} o {"campo": ["..."]}) en un texto legible. */
function extractMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;

  const parts = Object.entries(record).map(([field, value]) => {
    const text = Array.isArray(value) ? value.join(" ") : String(value);
    return field === "non_field_errors" ? text : `${field}: ${text}`;
  });
  return parts.length ? parts.join(" · ") : undefined;
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, auth = false, query, headers, ...init } = options;

  const url = new URL(`${API_URL}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  // FormData (subida de ficheros) se envía tal cual: fetch pone el
  // Content-Type multipart con su boundary.
  const isForm = body instanceof FormData;

  const finalHeaders = new Headers(headers);
  finalHeaders.set("Accept", "application/json");
  if (body !== undefined && !isForm) finalHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = await getAccessToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers: finalHeaders,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data);
  return data as T;
}

// --- Catálogo ---------------------------------------------------------------

export type ProductQuery = {
  page?: number;
  search?: string;
  category?: string;
  ordering?: string;
  price_min?: string;
  price_max?: string;
  available?: boolean;
  featured?: boolean;
};

export const getProducts = (query: ProductQuery = {}) =>
  api<Paginated<Product>>("/api/products/", { query });

export const getProduct = (slug: string) =>
  api<ProductDetail>(`/api/products/${encodeURIComponent(slug)}/`);

export const getCategories = () =>
  api<Paginated<Category>>("/api/categories/", { query: { page: 1 } });

// --- Cuenta -----------------------------------------------------------------

/**
 * Usuario de la sesión actual, o null si no hay sesión válida.
 * cache() evita repetir la llamada dentro de una misma petición (p. ej.
 * el layout del panel y la página que comprueba el rol).
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getAccessToken())) return null;
  try {
    return await api<User>("/api/users/me/", { auth: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

export const getOrders = (page = 1) =>
  api<Paginated<Order>>("/api/orders/", { auth: true, query: { page } });

export const getOrder = (number: string) =>
  api<Order>(`/api/orders/${encodeURIComponent(number)}/`, { auth: true });

/** Listas de favoritos del usuario; la primera es siempre la de por defecto. */
export const getWishlists = () => api<Wishlist[]>("/api/users/me/wishlists/", { auth: true });
