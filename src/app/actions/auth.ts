"use server";

import { redirect } from "next/navigation";

import { api, ApiError } from "@/lib/api";
import { STAFF_ROLES } from "@/lib/auth";
import { clearSession, getRefreshToken, setSession } from "@/lib/session";
import type { User } from "@/lib/types";

export type FormState = { error?: string } | undefined;

/** Solo se permite volver a rutas internas tras el login. */
function safeNext(value: FormDataEntryValue | null, fallback = "/cuenta") {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

async function obtainTokens(email: string, password: string) {
  const tokens = await api<{ access: string; refresh: string }>("/api/auth/token/", {
    method: "POST",
    body: { email, password },
  });
  await setSession(tokens);
  return tokens;
}

/** Destino por defecto tras el login: el panel para el personal, la cuenta para clientes. */
async function homeFor(access: string) {
  const me = await api<User>("/api/users/me/", {
    headers: { Authorization: `Bearer ${access}` },
  }).catch(() => null);
  return me && STAFF_ROLES.includes(me.role) ? "/panel" : "/cuenta";
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  let home: string;
  try {
    const tokens = await obtainTokens(email, password);
    home = await homeFor(tokens.access);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { error: "Email o contraseña incorrectos." };
    }
    return { error: error instanceof Error ? error.message : "No se ha podido iniciar sesión." };
  }

  redirect(safeNext(formData.get("next"), home));
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    await api("/api/auth/register/", {
      method: "POST",
      body: {
        email,
        password,
        first_name: String(formData.get("first_name") ?? ""),
        last_name: String(formData.get("last_name") ?? ""),
      },
    });
    await obtainTokens(email, password);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se ha podido crear la cuenta." };
  }

  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  const refresh = await getRefreshToken();
  if (refresh) {
    // Si falla (token ya caducado) da igual: la sesión local se borra igualmente.
    await api("/api/auth/logout/", { method: "POST", auth: true, body: { refresh } }).catch(
      () => undefined,
    );
  }
  await clearSession();
  redirect("/");
}
