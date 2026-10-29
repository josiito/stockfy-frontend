import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const body = Geist({
  variable: "--ff-body",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--ff-display",
  subsets: ["latin"],
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
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
