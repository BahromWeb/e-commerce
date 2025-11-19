"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, logout } from "@/lib/store";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="page-container flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl">
          {t('common.appName')}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/products" className="hover:text-accent transition">
                {t('header.products')}
              </Link>
              {user.role === "admin" ? (
                <>
                  <Link href="/dashboard" className="hover:text-accent transition">
                    {t('header.dashboard')}
                  </Link>
                  <Link href="/orders" className="hover:text-accent transition">
                    {t('header.orders')}
                  </Link>
                </>
              ) : (
                <Link href="/my-orders" className="hover:text-accent transition">
                  {t('header.myOrders')}
                </Link>
              )}
              <Link href="/profile" className="hover:text-accent transition">
                {t('header.profile')}
              </Link>
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="bg-error hover:opacity-90 px-4 py-2 rounded-lg transition"
              >
                {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent transition">
                {t('header.login')}
              </Link>
              <Link href="/register" className="btn-primary">
                {t('header.register')}
              </Link>
              <LanguageSwitcher />
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {mobileMenuOpen && user && (
        <div className="md:hidden bg-primary-light px-4 py-3 space-y-2">
          <Link href="/products" className="block hover:text-accent">
            {t('header.products')}
          </Link>
          {user.role === "admin" ? (
            <>
              <Link href="/dashboard" className="block hover:text-accent">
                {t('header.dashboard')}
              </Link>
              <Link href="/orders" className="block hover:text-accent">
                {t('header.orders')}
              </Link>
            </>
          ) : (
            <Link href="/my-orders" className="block hover:text-accent">
              {t('header.myOrders')}
            </Link>
          )}
          <Link href="/profile" className="block hover:text-accent">
            {t('header.profile')}
          </Link>
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="w-full btn-danger"
          >
            {t('common.logout')}
          </button>
        </div>
      )}
    </header>
  );
}
