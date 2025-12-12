"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store";
import { useState } from "react";
import { message } from 'antd';
import Image from "next/image";
import { FiShoppingCart, FiStar } from "react-icons/fi";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    message.success(`Added ${quantity} item(s) to cart`);
    setQuantity(1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all flex flex-col h-full">
      <div className="bg-gray-50 h-56 flex items-center justify-center p-4">
        <Image
          src={product.image}
          alt={product.title}
          width={180}
          height={180}
          className="object-contain h-full w-auto"
        />
      </div>
      <div className="p-4 flex flex-col grow">
        <h3 className="font-medium text-base mb-2 line-clamp-2 text-gray-900">
          {product.title}
        </h3>
        <p className="text-gray-500 text-sm mb-3 capitalize">
          {product.category}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <FiStar className="text-yellow-500" />
            {product.rating.rate}
          </span>
        </div>
        <div className="flex gap-2 mb-3 mt-auto">
          <input
            type="number"
            min="1"
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))}
            className="border border-gray-300 rounded px-3 py-2 w-16 text-center focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingCart />
            Add
          </button>
        </div>
        <Link
          href={`/products/${product.id}`}
          className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
