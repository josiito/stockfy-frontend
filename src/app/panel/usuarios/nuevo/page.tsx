import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/panel/page-header";
import { UserForm } from "@/components/panel/user-form";

export const metadata: Metadata = { title: "Nuevo usuario" };

export default function NewUserPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/panel/usuarios" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Usuarios
      </Link>
      <PageHeader title="Nuevo usuario" subtitle="Para dar de alta a un empleado o a otro administrador." />
      <UserForm />
    </div>
  );
}
