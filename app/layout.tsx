import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/components/ui/providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Marketplace - Shop Amazing Products",
  description: "Discover amazing products at great prices. Browse, add to cart, and manage your shopping easily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
