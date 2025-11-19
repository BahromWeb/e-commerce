"use client";

import { Header } from "@/components/header";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="page-container">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="section-title" suppressHydrationWarning>{t('home.welcome')}</h1>
          <p className="text-text-secondary text-lg mb-8" suppressHydrationWarning>
            {t('home.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary" suppressHydrationWarning>
              {t('home.browseProducts')}
            </Link>
            <Link href="/login" className="btn-secondary" suppressHydrationWarning>
              {t('home.signIn')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
