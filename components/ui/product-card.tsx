"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, addToCart } from "@/lib/store";
import { useState } from "react";
import { useToast } from "./toast-provider";
import { useTranslation } from 'react-i18next';
import Image from "next/image";

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
      <div className="bg-white h-48 flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={product.title}
          width={150}
          height={150}
          className="object-contain h-full w-auto"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-text-secondary text-sm mb-3">
          {t('cart.category')}: {product.category}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-accent">${product.price.toFixed(2)}</span>
          <span className="badge badge-success flex items-center gap-1">
            ⭐ {product.rating.rate} ({product.rating.count})
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
            className="input-field shrink-0 w-20"
          />
          <button
            onClick={handleAddToCart}
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
