"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Product } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";
import ProductCard from "@/components/ui/product-card";
import { PuffLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';


export default function ProductsPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let response;
      if (category) {
        response = await productAPI.getByCategory(category);
      } else {
        response = await productAPI.getAll();
      }
      const productsData = response.data;
      setAllProducts(productsData);
      
      // Filter by search term on client side
      if (searchTerm) {
        const filtered = productsData.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
      } else {
        setProducts(productsData);
      }
    } catch {
      showToast(t('products.loadFailed'), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      const filtered = allProducts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title" suppressHydrationWarning>{t('products.all')}</h1>

        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder={t('products.search')}
              className="input-field flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              suppressHydrationWarning
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field md:w-48"
              suppressHydrationWarning
            >
              <option value="" suppressHydrationWarning>{t('products.categories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} suppressHydrationWarning>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary" suppressHydrationWarning>
              {t('common.search')}
            </button>
            {user?.role?.toUpperCase() === "ADMIN" && (
              <button
                type="button"
                onClick={() => router.push("/products/new")}
                className="btn-primary"
                suppressHydrationWarning
              >
                {t('products.addProduct')}
              </button>
            )}
          </form>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <PuffLoader color="#6366f1" size={80} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-text-secondary" suppressHydrationWarning>
            {t('products.noProducts')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
