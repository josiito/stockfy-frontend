const PALETTES = [
  ["var(--brand-soft)", "var(--brand)", "var(--accent)"],
  ["var(--accent-soft)", "var(--accent)", "var(--info)"],
  ["var(--info-soft)", "var(--info)", "var(--brand)"],
];

/** Fondo geométrico para productos que aún no tienen foto. */
export function ImagePlaceholder({ seed = 0 }: { seed?: number }) {
  const [bg, a, b] = PALETTES[seed % PALETTES.length];
  return (
    <div className="absolute inset-0" style={{ background: bg }} aria-hidden>
      <div
        className="absolute -bottom-10 -left-6 size-40 rounded-full opacity-80"
        style={{ background: a }}
      />
      <div
        className="absolute right-8 top-8 size-16 rounded-2xl opacity-90 rotate-12"
        style={{ background: b }}
      />
    </div>
  );
}
