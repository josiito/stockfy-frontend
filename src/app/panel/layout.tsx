import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AccessDenied } from "@/components/panel/access-denied";
import { PanelShell, PanelShellSkeleton } from "@/components/panel/panel-shell";
import { getCurrentUser } from "@/lib/api";
import { isStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Panel de gestión", template: "%s · Panel Stockfy" },
  robots: { index: false },
};

/**
 * Solo ADMIN y EMPLEADO ven el panel. El proxy ya manda al login a quien
 * no tiene sesión; aquí se comprueba el rol. Las páginas no se renderizan
 * (ni piden datos) hasta que el rol es válido.
 */
async function PanelGate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);

  if (!user) redirect("/login?next=/panel");
  if (!isStaff(user)) return <AccessDenied />;

  return <PanelShell user={user}>{children}</PanelShell>;
}

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <Suspense fallback={<PanelShellSkeleton />}>
      <PanelGate>{children}</PanelGate>
    </Suspense>
  );
}
