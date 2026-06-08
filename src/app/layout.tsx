import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CartProviderWrapper from "@/context/CartProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Omix Store — Shop Smart in Kericho",
  description:
    "Kericho's cleanest online store. Browse electronics, fashion, beauty, home goods, and school supplies. Pay via M-Pesa.",
  keywords: [
    "e-commerce",
    "online store",
    "Kericho",
    "electronics",
    "fashion",
    "beauty",
    "home",
    "school supplies",
    "M-Pesa",
    "Omix",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased`}>
        <CartProviderWrapper>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProviderWrapper>
      </body>
    </html>
  );
}
