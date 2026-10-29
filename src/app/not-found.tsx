import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-display text-8xl font-extrabold text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">No encontramos esta página</h1>
      <p className="mt-2 text-ink-muted">Puede que el producto ya no esté disponible.</p>
      <Link href="/productos" className="btn-primary mt-8">Volver al catálogo</Link>
    </div>
  );
}
