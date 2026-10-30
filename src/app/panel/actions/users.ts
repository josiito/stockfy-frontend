"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { api } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import type { AdminUser } from "@/lib/types";

import { type ActionState, errorMessage, field, idField } from "./state";

// Todas estas acciones son solo para ADMIN; el backend también lo exige.
const ADMIN_ONLY = ["ADMIN"] as const;

function refresh(userId?: number) {
  revalidatePath("/panel/usuarios");
  if (userId) revalidatePath(`/panel/usuarios/${userId}`);
}

export async function saveUser(_: ActionState, formData: FormData): Promise<ActionState> {
  const userId = Number(formData.get("user_id")) || null;
  const password = String(formData.get("password") ?? "");

  const body: Record<string, unknown> = {
    email: field(formData, "email"),
    first_name: field(formData, "first_name"),
    last_name: field(formData, "last_name"),
    phone: field(formData, "phone"),
    role: field(formData, "role"),
  };
  if (password) body.password = password;
  if (!userId) body.username = body.email;

  let user: AdminUser;
  try {
    await requireRole([...ADMIN_ONLY]);
    user = await api<AdminUser>(userId ? `/api/admin/users/${userId}/` : "/api/admin/users/", {
      method: userId ? "PATCH" : "POST",
      auth: true,
      body,
    });
  } catch (error) {
    return { error: errorMessage(error, "No se ha podido guardar el usuario.") };
  }

  refresh(user.id);
  if (!userId) redirect(`/panel/usuarios/${user.id}`);
  return { ok: password ? "Cambios guardados. La contraseña se ha actualizado." : "Cambios guardados." };
}

export async function deactivateUser(formData: FormData) {
  const userId = idField(formData, "user_id");
  await requireRole([...ADMIN_ONLY]);
  await api(`/api/admin/users/${userId}/`, { method: "DELETE", auth: true });
  refresh(userId);
}

export async function activateUser(formData: FormData) {
  const userId = idField(formData, "user_id");
  await requireRole([...ADMIN_ONLY]);
  await api(`/api/admin/users/${userId}/activate/`, { method: "POST", auth: true });
  refresh(userId);
}
