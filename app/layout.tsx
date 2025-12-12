import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/components/ui/providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Bozor - Ajoyib Mahsulotlar Do'koni",
  description: "Ajoyib mahsulotlarni qulay narxlarda kashf eting. Ko'rib chiqing, savatchaga qo'shing va xaridlaringizni oson boshqaring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
