import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthForm } from "@/app/login/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthShell title="Crea tu cuenta" subtitle="Guarda favoritos, sigue tus pedidos y compra más rápido.">
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
