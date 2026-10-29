// Compartido entre proxy.ts y el código de servidor de la app.

export const ACCESS_COOKIE = "stockfy_access";
export const REFRESH_COOKIE = "stockfy_refresh";

// Duraciones alineadas con SIMPLE_JWT del backend.
export const ACCESS_MAX_AGE = 30 * 60;
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
