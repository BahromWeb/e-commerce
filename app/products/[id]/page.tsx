"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { Header } from "@/components/header";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/store";
import { message, Spin } from 'antd';
import Image from "next/image";
import { FiArrowLeft, FiShoppingCart, FiStar } from "react-icons/fi";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getById(Number(id));
      setProduct(response.data || null);
    } catch {
      messageApi.error('Failed to load product');
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Product Not Found</h2>
            <button 
              onClick={() => router.push("/")} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    message.success(`Added ${quantity} item(s) to cart`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()} 
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
            {/* Product Image */}
            <div className="bg-gray-50 rounded flex items-center justify-center p-8">
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain h-96 w-auto"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold mb-4 text-gray-900">{product.title}</h1>
              <p className="text-3xl font-semibold mb-6 text-gray-900">${product.price.toFixed(2)}</p>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded capitalize text-sm">
                  {product.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <FiStar className="text-yellow-500" />
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-base font-medium mb-2 text-gray-900">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="mt-auto space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={99}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="border border-gray-300 rounded px-4 py-2 w-24 text-center focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <button 
                  onClick={handleAddToCart} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
                <button 
                  onClick={() => router.push("/")} 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
