import { Suspense } from "react";

import { AccessDenied } from "@/components/panel/access-denied";
import { getCurrentUser } from "@/lib/api";
import { isAdmin } from "@/lib/auth";

/** Los empleados entran en el panel, pero la gestión de usuarios es solo para ADMIN. */
async function AdminGate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  if (!isAdmin(user)) {
    return <AccessDenied message="La gestión de usuarios solo está disponible para administradores." />;
  }
  return children;
}

export default function UsersLayout({ children }: LayoutProps<"/panel/usuarios">) {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
