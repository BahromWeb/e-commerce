"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, logout } from "@/lib/store";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./ui/language-switcher";

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    dispatch(logout());
    router.push("/login");
  };

  return (
    <header className="bg-primary text-white shadow-md sticky top-0 z-50">
      <nav className="page-container flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-xl">
          {t('common.appName')}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link href="/products" className="hover:text-accent transition" suppressHydrationWarning>
                {t('header.products')}
              </Link>
              {user.role?.toUpperCase() === "ADMIN" ? (
                <>
                  <Link href="/dashboard" className="hover:text-accent transition" suppressHydrationWarning>
                    {t('header.dashboard')}
                  </Link>
                  <Link href="/orders" className="hover:text-accent transition" suppressHydrationWarning>
                    {t('header.orders')}
                  </Link>
                </>
              ) : (
                <Link href="/my-orders" className="hover:text-accent transition" suppressHydrationWarning>
                  {t('header.myOrders')}
                </Link>
              )}
              <Link href="/cart" className="hover:text-accent transition relative" suppressHydrationWarning>
                🛒 Cart
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="hover:text-accent transition" suppressHydrationWarning>
                {t('header.profile')}
              </Link>
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="bg-error hover:opacity-90 px-4 py-2 rounded-lg transition"
                suppressHydrationWarning
              >
                {t('common.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent transition" suppressHydrationWarning>
                {t('header.login')}
              </Link>
              <Link href="/register" className="btn-primary" suppressHydrationWarning>
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
          <Link href="/products" className="block hover:text-accent" suppressHydrationWarning>
            {t('header.products')}
          </Link>
          {user.role?.toUpperCase() === "ADMIN" ? (
            <>
              <Link href="/dashboard" className="block hover:text-accent" suppressHydrationWarning>
                {t('header.dashboard')}
              </Link>
              <Link href="/orders" className="block hover:text-accent" suppressHydrationWarning>
                {t('header.orders')}
              </Link>
            </>
          ) : (
            <Link href="/my-orders" className="block hover:text-accent" suppressHydrationWarning>
              {t('header.myOrders')}
            </Link>
          )}
          <Link href="/cart" className="block hover:text-accent" suppressHydrationWarning>
            🛒 Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
          </Link>
          <Link href="/profile" className="block hover:text-accent" suppressHydrationWarning>
            {t('header.profile')}
          </Link>
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="w-full btn-danger"
            suppressHydrationWarning
          >
            {t('common.logout')}
          </button>
        </div>
      )}
    </header>
  );
}
