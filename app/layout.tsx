import type { Metadata } from "next";
import { Archivo, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import Footer from "@/components/Footer";

const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-archivo", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Computec — Laptops, PC Components & Phones in Pakistan",
  description:
    "Pakistan's destination for laptops, PC components, peripherals and phones. Genuine products, fast delivery, JazzCash · EasyPaisa · Card · Cash on Delivery.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ source }, settings] = await Promise.all([getProducts(), getSiteSettings()]);

  return (
    <html lang="en" className={`${archivo.variable} ${manrope.variable} ${mono.variable}`}>
      <body>
        <CartProvider>
          <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <TopBar socials={settings.socials} />
            <Header />
            <CategoryBar />
            {children}
            <Footer source={source} />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
