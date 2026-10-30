import "server-only";

import { getCurrentUser } from "./api";
import type { Role, User } from "./types";

export const STAFF_ROLES: Role[] = ["ADMIN", "EMPLOYEE"];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  EMPLOYEE: "Empleado",
  CUSTOMER: "Cliente",
};

export const isStaff = (user: User | null) => !!user && STAFF_ROLES.includes(user.role);
export const isAdmin = (user: User | null) => user?.role === "ADMIN";

/**
 * Comprobación para las Server Actions del panel. El backend vuelve a
 * comprobar los permisos en cada petición; esto solo evita llamadas
 * que sabemos que van a fallar y da un mensaje claro.
 */
export async function requireRole(roles: Role[] = STAFF_ROLES): Promise<User> {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) {
    throw new Error("No tienes permiso para realizar esta acción.");
  }
  return user;
}
