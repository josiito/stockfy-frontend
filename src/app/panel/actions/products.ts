"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { api } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { NEGATIVE_MOVEMENTS } from "@/lib/labels";
import type { AdminImage, AdminProduct, MovementType } from "@/lib/types";

import { type ActionState, errorMessage, field, idField, slugify } from "./state";

const productPath = (id: number) => `/panel/productos/${id}`;

function refresh(productId?: number) {
  revalidatePath("/panel", "layout");
  if (productId) revalidatePath(productPath(productId));
}

// --- Producto ------------------------------------------------------------------

export async function saveProduct(_: ActionState, formData: FormData): Promise<ActionState> {
  const productId = Number(formData.get("product_id")) || null;
  const name = field(formData, "name");

  const body = {
    name,
    slug: slugify(field(formData, "slug") || name),
    category: Number(formData.get("category")) || null,
    short_description: field(formData, "short_description"),
    description: field(formData, "description"),
    status: field(formData, "status") || "DRAFT",
    featured: formData.get("featured") === "on",
  };

  let product: AdminProduct;
  try {
    await requireRole();
    product = await api<AdminProduct>(
      productId ? `/api/admin/products/${productId}/` : "/api/admin/products/",
      { method: productId ? "PATCH" : "POST", auth: true, body },
    );
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido guardar el producto.") };
  }

  refresh(product.id);
  if (!productId) redirect(productPath(product.id));
  return { ok: "Cambios guardados." };
}

/** El backend no borra productos: los marca como archivados (dejan de verse en la tienda). */
export async function archiveProduct(formData: FormData) {
  const productId = idField(formData, "product_id");
  await requireRole();
  await api(`/api/admin/products/${productId}/`, { method: "DELETE", auth: true });
  refresh(productId);
}

// --- Variantes -----------------------------------------------------------------

/** Valores elegidos en los selectores "attr_<id>" del formulario. */
function attributeValues(formData: FormData) {
  return [...formData.entries()]
    .filter(([key, value]) => key.startsWith("attr_") && value !== "")
    .map(([, value]) => Number(value));
}

function variantBody(formData: FormData) {
  return {
    sku: field(formData, "sku").toUpperCase(),
    price: field(formData, "price"),
    compare_at_price: field(formData, "compare_at_price") || null,
    status: field(formData, "status") || "ACTIVE",
    attributes: attributeValues(formData),
  };
}

export async function createVariant(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const productId = idField(formData, "product_id");
    await requireRole();
    await api("/api/admin/variants/", {
      method: "POST",
      auth: true,
      body: { product: productId, ...variantBody(formData) },
    });
    refresh(productId);
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido crear la variante.") };
  }
  return { ok: "Variante creada. Su stock empieza en 0: añade unidades con «Ajustar stock»." };
}

export async function updateVariant(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const productId = idField(formData, "product_id");
    const variantId = idField(formData, "variant_id");
    await requireRole();
    await api(`/api/admin/variants/${variantId}/`, {
      method: "PATCH",
      auth: true,
      body: variantBody(formData),
    });
    refresh(productId);
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido guardar la variante.") };
  }
  return { ok: "Variante guardada." };
}

export async function adjustStock(_: ActionState, formData: FormData): Promise<ActionState> {
  const movementType = field(formData, "movement_type") as MovementType;
  const amount = Number(field(formData, "quantity"));

  if (!Number.isInteger(amount) || amount === 0) {
    return { error: "Indica una cantidad entera distinta de 0." };
  }

  // En ventas y daños el usuario escribe unidades positivas; se restan.
  const quantity = NEGATIVE_MOVEMENTS.includes(movementType) ? -Math.abs(amount) : movementType === "CORRECTION" ? amount : Math.abs(amount);

  try {
    const productId = idField(formData, "product_id");
    const variantId = idField(formData, "variant_id");
    await requireRole();
    await api(`/api/admin/variants/${variantId}/adjust-stock/`, {
      method: "POST",
      auth: true,
      body: { quantity, movement_type: movementType, reason: field(formData, "reason") },
    });
    refresh(productId);
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido ajustar el stock.") };
  }
  return { ok: `Stock actualizado (${quantity > 0 ? "+" : ""}${quantity}).` };
}

/** Descataloga la variante (el backend no la borra para conservar el histórico). */
export async function discontinueVariant(formData: FormData) {
  const productId = idField(formData, "product_id");
  const variantId = idField(formData, "variant_id");
  await requireRole();
  await api(`/api/admin/variants/${variantId}/`, { method: "DELETE", auth: true });
  refresh(productId);
}

// --- Imágenes ------------------------------------------------------------------

export async function uploadImage(_: ActionState, formData: FormData): Promise<ActionState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Elige una imagen." };

  try {
    const productId = idField(formData, "product_id");
    await requireRole();

    // Se reenvía como multipart al backend, que la sube al bucket (R2).
    const upload = new FormData();
    upload.set("product", String(productId));
    upload.set("file", file);
    upload.set("alt_text", field(formData, "alt_text"));
    upload.set("position", field(formData, "position") || "0");

    const image = await api<AdminImage>("/api/admin/images/", { method: "POST", auth: true, body: upload });

    if (formData.get("is_primary") === "on") await makePrimary(productId, image.id);
    refresh(productId);
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido subir la imagen.") };
  }
  return { ok: "Imagen subida." };
}

/** Deja una sola imagen principal por producto. */
async function makePrimary(productId: number, imageId: number) {
  const images = await api<{ results: AdminImage[] }>("/api/admin/images/", {
    auth: true,
    query: { product: productId },
  });
  await Promise.all(
    images.results
      .filter((img) => img.is_primary !== (img.id === imageId))
      .map((img) =>
        api(`/api/admin/images/${img.id}/`, {
          method: "PATCH",
          auth: true,
          body: { is_primary: img.id === imageId },
        }),
      ),
  );
}

export async function setPrimaryImage(formData: FormData) {
  const productId = idField(formData, "product_id");
  const imageId = idField(formData, "image_id");
  await requireRole();
  await makePrimary(productId, imageId);
  refresh(productId);
}

export async function deleteImage(formData: FormData) {
  const productId = idField(formData, "product_id");
  const imageId = idField(formData, "image_id");
  await requireRole();
  await api(`/api/admin/images/${imageId}/`, { method: "DELETE", auth: true });
  refresh(productId);
}
