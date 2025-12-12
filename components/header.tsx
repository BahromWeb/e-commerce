"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useState } from "react";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

export function Header() {
  const { items } = useSelector((state: RootState) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="font-semibold text-xl text-gray-900 hover:text-gray-700 transition-colors">
          Mini Bozor
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Mahsulotlar
          </Link>
          <Link href="/cart" className="relative flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <FiShoppingCart className="text-lg" />
            <span>Savat</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        <button
          className="md:hidden text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
          <Link href="/" className="block py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
            Mahsulotlar
          </Link>
          <Link href="/cart" className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileMenuOpen(false)}>
            <FiShoppingCart />
            <span>Savat</span>
            {cartItemsCount > 0 && <span className="ml-auto text-sm text-gray-500">({cartItemsCount})</span>}
          </Link>
        </div>
      )}
    </header>
  );
}
