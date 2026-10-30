import "server-only";

import { api } from "./api";
import type {
  AdminCategory,
  AdminImage,
  AdminProduct,
  AdminUser,
  AdminVariant,
  CategoryAttribute,
  InventoryMovement,
  Paginated,
} from "./types";

// Lecturas del panel. Las escrituras son Server Actions en
// src/app/panel/actions/.

export type AdminProductQuery = {
  page?: number;
  search?: string;
  status?: string;
  category?: string;
  ordering?: string;
};

export const getAdminProducts = (query: AdminProductQuery = {}) =>
  api<Paginated<AdminProduct>>("/api/admin/products/", { auth: true, query });

export const getAdminProduct = (id: number) =>
  api<AdminProduct>(`/api/admin/products/${id}/`, { auth: true });

/** Todas las categorías (también las inactivas), para los selectores. */
export const getAdminCategories = () =>
  api<Paginated<AdminCategory>>("/api/admin/categories/", {
    auth: true,
    query: { page_size: 200, ordering: "name" },
  });

/** Atributos que admite una categoría, con sus valores posibles. */
export const getCategoryAttributes = (slug: string) =>
  api<CategoryAttribute[]>(`/api/categories/${encodeURIComponent(slug)}/attributes/`);

export const getProductVariants = (productSlug: string) =>
  api<Paginated<AdminVariant>>("/api/admin/variants/", {
    auth: true,
    query: { product: productSlug, ordering: "created_at" },
  });

export const getProductImages = (productId: number) =>
  api<Paginated<AdminImage>>("/api/admin/images/", {
    auth: true,
    query: { product: productId },
  });

export const getLowStockVariants = () =>
  api<Paginated<AdminVariant>>("/api/admin/variants/", {
    auth: true,
    query: { status: "ACTIVE", ordering: "stock" },
  });

export const getRecentMovements = () =>
  api<Paginated<InventoryMovement>>("/api/admin/inventory-movements/", { auth: true });

export type AdminUserQuery = {
  page?: number;
  search?: string;
  role?: string;
  is_active?: string;
};

export const getAdminUsers = (query: AdminUserQuery = {}) =>
  api<Paginated<AdminUser>>("/api/admin/users/", { auth: true, query });

export const getAdminUser = (id: number) =>
  api<AdminUser>(`/api/admin/users/${id}/`, { auth: true });
