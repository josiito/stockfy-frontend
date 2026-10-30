"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { login, register } from "@/app/actions/auth";
import { FormError } from "@/components/form-error";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(mode === "login" ? login : register, undefined);
  const otherHref = (path: string) => (next ? `${path}?next=${encodeURIComponent(next)}` : path);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {mode === "register" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="first_name">Nombre</label>
            <input id="first_name" name="first_name" className="input" autoComplete="given-name" />
          </div>
          <div>
            <label className="label" htmlFor="last_name">Apellidos</label>
            <input id="last_name" name="last_name" className="input" autoComplete="family-name" />
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>

      <FormError message={state?.error} />

      <button className="btn-primary w-full py-3.5 text-base" disabled={pending}>
        {pending ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-ink-muted">
        {mode === "login" ? (
          <>¿Aún no tienes cuenta? <Link href={otherHref("/registro")} className="font-semibold text-brand hover:underline">Regístrate</Link></>
        ) : (
          <>¿Ya tienes cuenta? <Link href={otherHref("/login")} className="font-semibold text-brand hover:underline">Entra</Link></>
        )}
      </p>
    </form>
  );
}
