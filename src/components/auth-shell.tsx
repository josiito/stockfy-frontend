/** Marco de dos columnas para login y registro. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-page grid min-h-[calc(100vh-12rem)] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="relative hidden h-full min-h-[520px] overflow-hidden rounded-[2.5rem] bg-info-fill lg:block">
        <div className="absolute -left-20 bottom-0 size-96 rounded-full bg-brand-fill" aria-hidden />
        <div className="absolute right-10 top-10 size-40 rounded-full bg-accent-fill" aria-hidden />
        <div className="absolute bottom-16 right-16 size-24 rotate-12 rounded-3xl border-4 border-white/70" aria-hidden />
        <p className="absolute left-10 top-10 max-w-xs font-display text-3xl font-bold leading-tight text-white">
          Piezas hechas a mano, pensadas para durar.
        </p>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-ink-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
