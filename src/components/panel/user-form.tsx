"use client";

import { useActionState } from "react";

import { saveUser } from "@/app/panel/actions/users";
import { FormError } from "@/components/form-error";
import type { AdminUser, Role } from "@/lib/types";

import { FormSuccess } from "./form-success";

const ROLES: { value: Role; label: string; help: string }[] = [
  { value: "ADMIN", label: "Administrador", help: "Todo, incluida la gestión de usuarios." },
  { value: "EMPLOYEE", label: "Empleado", help: "Productos, stock y pedidos. Sin gestión de usuarios." },
  { value: "CUSTOMER", label: "Cliente", help: "Solo compra en la tienda. No entra en el panel." },
];

export function UserForm({ user, isSelf = false }: { user?: AdminUser; isSelf?: boolean }) {
  const [state, action, pending] = useActionState(saveUser, undefined);

  return (
    <form action={action} className="card space-y-5 p-6">
      {user && <input type="hidden" name="user_id" value={user.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="email">Email (para entrar)</label>
          <input id="email" name="email" type="email" required defaultValue={user?.email} className="input" autoComplete="off" />
        </div>
        <div>
          <label className="label" htmlFor="first_name">Nombre</label>
          <input id="first_name" name="first_name" defaultValue={user?.first_name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="last_name">Apellidos</label>
          <input id="last_name" name="last_name" defaultValue={user?.last_name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Teléfono</label>
          <input id="phone" name="phone" type="tel" defaultValue={user?.phone} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">{user ? "Nueva contraseña" : "Contraseña"}</label>
          <input
            id="password"
            name="password"
            type="password"
            required={!user}
            minLength={8}
            placeholder={user ? "Déjalo vacío para no cambiarla" : undefined}
            className="input"
            autoComplete="new-password"
          />
        </div>
      </div>

      <fieldset>
        <legend className="label">Perfil</legend>
        {isSelf && (
          <p className="mb-2 text-xs text-ink-muted">No puedes cambiar tu propio perfil.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          {ROLES.map((role) => (
            <label
              key={role.value}
              className="flex cursor-pointer gap-3 rounded-2xl border border-line p-4 transition has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60"
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={(user?.role ?? "EMPLOYEE") === role.value}
                disabled={isSelf && user?.role !== role.value}
                className="mt-0.5 size-4 accent-[var(--brand)]"
              />
              <span>
                <span className="block text-sm font-semibold">{role.label}</span>
                <span className="block text-xs text-ink-muted">{role.help}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <FormError message={state?.error} />
      <FormSuccess message={state?.ok} />

      <div className="flex justify-end">
        <button className="btn-primary" disabled={pending}>
          {pending ? "Guardando…" : user ? "Guardar cambios" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}
