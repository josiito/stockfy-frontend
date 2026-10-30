import { NextResponse, type NextRequest } from "next/server";

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  cookieOptions,
} from "@/lib/auth-cookies";

const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");

// Rutas que exigen sesión iniciada. El rol de /panel se comprueba en su
// layout (src/app/panel/layout.tsx) y, en última instancia, en el backend.
const PROTECTED = ["/cuenta", "/checkout", "/panel"];

/** Segundos que le quedan al JWT, o 0 si no se puede leer. */
function secondsLeft(token: string | undefined) {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp - Date.now() / 1000;
  } catch {
    return 0;
  }
}

async function refreshTokens(refresh: string) {
  const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;
  return (await response.json()) as { access: string; refresh?: string };
}

/**
 * Renueva el token de acceso antes de que caduque (el backend rota también
 * el refresh) y protege las rutas privadas.
 */
export async function proxy(request: NextRequest) {
  let access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  let tokens: { access: string; refresh?: string } | null = null;
  let expired = false;

  if (refresh && secondsLeft(access) < 60) {
    tokens = await refreshTokens(refresh).catch(() => null);
    if (tokens) {
      access = tokens.access;
      // Los Server Components de esta petición deben ver el token nuevo.
      request.cookies.set(ACCESS_COOKIE, tokens.access);
      if (tokens.refresh) request.cookies.set(REFRESH_COOKIE, tokens.refresh);
    } else {
      access = undefined;
      expired = true;
      request.cookies.delete(ACCESS_COOKIE);
      request.cookies.delete(REFRESH_COOKIE);
    }
  }

  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  let response: NextResponse;
  if (isProtected && !access) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + search);
    response = NextResponse.redirect(login);
  } else {
    response = NextResponse.next({ request });
  }

  if (tokens) {
    response.cookies.set(ACCESS_COOKIE, tokens.access, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
    if (tokens.refresh) {
      response.cookies.set(REFRESH_COOKIE, tokens.refresh, {
        ...cookieOptions,
        maxAge: REFRESH_MAX_AGE,
      });
    }
  } else if (expired) {
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)"],
};
