"use client";

import { Header } from "@/components/header";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/lib/types";
import { productAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { Spin } from 'antd';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoriesRes = await productAPI.getCategories();
        setCategories(categoriesRes.data);

        // Fetch products
        const productsRes = await productAPI.getAll();
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Mahsulotlarni yuklashda xatolik. Iltimos, keyinroq qayta urinib ko'ring.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <Spin size="large" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
          <p className="text-red-600 text-2xl font-bold">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Mahsulotlar
            </h1>
            <p className="text-gray-600">
              Sifatli mahsulotlar to'plamimizni ko'rib chiqing
            </p>
          </div>
        </div>

        {/* Category Filter & Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kategoriyalar</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Barchasi
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded font-medium capitalize transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              {selectedCategory === "all" ? "Barcha Mahsulotlar" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              <span className="text-gray-500 ml-2 text-base font-normal">({filteredProducts.length})</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
