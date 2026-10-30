/**
 * Fondo neutro para productos que aún no tienen foto: textura de líneas
 * finas, como un tejido, con el monograma de la marca.
 */
export function ImagePlaceholder({ seed = 0, monogram = true }: { seed?: number; monogram?: boolean }) {
  const tones = ["var(--surface-muted)", "var(--brand-soft)", "var(--accent-soft)"];
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        backgroundColor: tones[seed % tones.length],
        backgroundImage:
          "repeating-linear-gradient(135deg, color-mix(in srgb, var(--ink) 5%, transparent) 0 1px, transparent 1px 10px)",
      }}
      aria-hidden
    >
      {monogram && <span className="font-display text-5xl font-semibold text-ink/15">S</span>}
    </div>
  );
}
