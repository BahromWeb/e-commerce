"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, addToCart } from "@/lib/store";
import { useState } from "react";
import { useToast } from "./toast-provider";
import { useTranslation } from 'react-i18next';

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      showToast(t('cart.loginFirst'), "warning");
      return;
    }
    dispatch(addToCart({ product, quantity }));
    showToast(t('cart.itemAdded', { quantity }), "success");
    setQuantity(1);
  };

  return (
    <div className="card overflow-hidden">
      <div className="bg-surface-secondary h-48 flex items-center justify-center">
        <div className="text-6xl">📦</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-text-secondary text-sm mb-3">
          {t('cart.category')}: {product.category}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-accent">${product.price.toFixed(2)}</span>
          <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-error"}`}>
            {product.stock > 0 ? t('products.inStock', { count: product.stock }) : t('products.outOfStock')}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
            className="input-field shrink-0 w-20"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex-1"
          >
            {t('products.addToCart')}
          </button>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="block text-center text-accent hover:underline mt-3"
        >
          {t('products.viewDetails')}
        </Link>
      </div>
    </div>
  );
}
