import { ArrowLeft, UserCheck, UserX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { activateUser, deactivateUser } from "@/app/panel/actions/users";
import { ApiUnavailable } from "@/components/api-error";
import { ConfirmForm } from "@/components/panel/confirm-form";
import { PageHeader } from "@/components/panel/page-header";
import { Badge, ROLE_TONES } from "@/components/panel/status-badge";
import { UserForm } from "@/components/panel/user-form";
import { getAdminUser } from "@/lib/admin-api";
import { ApiError, getCurrentUser } from "@/lib/api";
import { ROLE_LABELS } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Editar usuario" };

async function UserEditor({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  let user, me;
  try {
    [user, me] = await Promise.all([getAdminUser(id), getCurrentUser()]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ApiUnavailable />;
  }

  const isSelf = me?.id === user.id;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <>
      <PageHeader
        title={name}
        subtitle={`Alta: ${formatDate(user.date_joined)} · Último acceso: ${user.last_login ? formatDate(user.last_login) : "nunca"}`}
        actions={
          <>
            <Badge tone={ROLE_TONES[user.role]}>{ROLE_LABELS[user.role]}</Badge>
            {user.is_active ? <Badge tone="green">Activo</Badge> : <Badge tone="grey">Desactivado</Badge>}
            {!isSelf &&
              (user.is_active ? (
                <ConfirmForm
                  action={deactivateUser}
                  fields={{ user_id: user.id }}
                  confirm={`¿Desactivar a ${user.email}? No podrá entrar, pero se conservan sus pedidos.`}
                  className="btn-ghost text-danger hover:border-danger hover:text-danger"
                >
                  <UserX className="size-4" /> Desactivar
                </ConfirmForm>
              ) : (
                <ConfirmForm action={activateUser} fields={{ user_id: user.id }} confirm={`¿Reactivar a ${user.email}?`}>
                  <UserCheck className="size-4" /> Reactivar
                </ConfirmForm>
              ))}
          </>
        }
      />
      <UserForm user={user} isSelf={isSelf} />
    </>
  );
}

export default function EditUserPage(props: PageProps<"/panel/usuarios/[id]">) {
  return (
    <div className="max-w-3xl">
      <Link href="/panel/usuarios" className="mb-4 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Usuarios
      </Link>
      <Suspense fallback={<div className="card h-[28rem] animate-pulse" />}>
        <UserEditor params={props.params} />
      </Suspense>
    </div>
  );
}
