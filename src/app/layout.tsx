import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-provider";

import "./globals.css";

const body = Geist({
  variable: "--ff-body",
  subsets: ["latin"],
});

// Serif para titulares: tono artesanal y editorial.
const display = Fraunces({
  variable: "--ff-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Stockfy · Artesanía para tu descanso",
    template: "%s · Stockfy",
  },
  description: "Cabeceros, somieres y artesanía hechos a mano, con stock real y envío a domicilio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${body.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* La cabecera y el pie de la tienda están en (tienda)/layout.tsx;
            el panel de gestión (/panel) tiene los suyos. */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
