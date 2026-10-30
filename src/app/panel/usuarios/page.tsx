import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ApiUnavailable } from "@/components/api-error";
import { PageHeader } from "@/components/panel/page-header";
import { Pagination } from "@/components/panel/pagination";
import { Badge, ROLE_TONES } from "@/components/panel/status-badge";
import { getAdminUsers } from "@/lib/admin-api";
import { ROLE_LABELS } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { paramsKey } from "@/lib/search-params";

export const metadata: Metadata = { title: "Usuarios" };

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

async function Filters({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  return (
    <form key={paramsKey(params)} action="/panel/usuarios" className="card mb-6 grid gap-3 p-4 sm:grid-cols-[1fr_180px_160px_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
        <input name="search" defaultValue={first(params.search)} placeholder="Email o nombre…" className="input pl-10" aria-label="Buscar" />
      </div>
      <select name="role" defaultValue={first(params.role) ?? ""} className="input" aria-label="Perfil">
        <option value="">Todos los perfiles</option>
        {Object.entries(ROLE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select name="is_active" defaultValue={first(params.is_active) ?? ""} className="input" aria-label="Estado">
        <option value="">Activos e inactivos</option>
        <option value="true">Activos</option>
        <option value="false">Desactivados</option>
      </select>
      <button className="btn-primary">Filtrar</button>
    </form>
  );
}

async function UserTable({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(first(params.page)) || 1;

  let data;
  try {
    data = await getAdminUsers({
      page,
      search: first(params.search),
      role: first(params.role),
      is_active: first(params.is_active),
    });
  } catch {
    return <ApiUnavailable />;
  }

  if (!data.results.length) {
    return <p className="card p-10 text-center text-ink-muted">No hay usuarios con estos filtros.</p>;
  }

  return (
    <>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Usuario</th>
              <th className="px-3 py-3 font-semibold">Perfil</th>
              <th className="px-3 py-3 font-semibold">Estado</th>
              <th className="px-3 py-3 font-semibold">Alta</th>
              <th className="px-5 py-3 font-semibold">Último acceso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.results.map((u) => (
              <tr key={u.id} className="transition hover:bg-surface-muted/60">
                <td className="px-5 py-3">
                  <Link href={`/panel/usuarios/${u.id}`} className="block">
                    <span className="block font-semibold hover:text-brand">
                      {[u.first_name, u.last_name].filter(Boolean).join(" ") || u.email}
                    </span>
                    {(u.first_name || u.last_name) && <span className="block text-xs text-ink-muted">{u.email}</span>}
                  </Link>
                </td>
                <td className="px-3 py-3"><Badge tone={ROLE_TONES[u.role]}>{ROLE_LABELS[u.role]}</Badge></td>
                <td className="px-3 py-3">
                  {u.is_active ? <Badge tone="green">Activo</Badge> : <Badge tone="grey">Desactivado</Badge>}
                </td>
                <td className="px-3 py-3 text-ink-muted">{formatDate(u.date_joined)}</td>
                <td className="px-5 py-3 text-ink-muted">{u.last_login ? formatDate(u.last_login) : "Nunca"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination base="/panel/usuarios" params={params} page={page} count={data.count} />
    </>
  );
}

export default function PanelUsersPage(props: PageProps<"/panel/usuarios">) {
  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle="Clientes, empleados y administradores. Solo visible para administradores."
        actions={
          <Link href="/panel/usuarios/nuevo" className="btn-primary">
            <Plus className="size-4" /> Nuevo usuario
          </Link>
        }
      />
      <Suspense fallback={<div className="card mb-6 h-16 animate-pulse" />}>
        <Filters searchParams={props.searchParams} />
      </Suspense>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <UserTable searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}
