import "server-only";

import { cookies } from "next/headers";

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  cookieOptions,
} from "./auth-cookies";

export async function setSession(tokens: { access: string; refresh?: string }) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, tokens.access, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
  if (tokens.refresh) {
    store.set(REFRESH_COOKIE, tokens.refresh, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}
