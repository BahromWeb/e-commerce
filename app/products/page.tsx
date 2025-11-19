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
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let response;
      if (searchTerm || category) {
        response = await productAPI.search(
          searchTerm || undefined, 
          category || undefined, 
          page, 
          12
        );
      } else {
        response = await productAPI.getAll(page, 12);
      }
      setProducts(response.data.data?.content || []);
      setTotalPages(response.data.data?.totalPages || 0);
    } catch {
      showToast(t('products.loadFailed'), "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (page === 0) {
      fetchProducts();
    } else {
      setPage(0);
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
              className="input-field md:w-40"
              suppressHydrationWarning
            >
              <option value="" suppressHydrationWarning>{t('products.categories')}</option>
              <option value="electronics" suppressHydrationWarning>{t('products.electronics')}</option>
              <option value="clothing" suppressHydrationWarning>{t('products.clothing')}</option>
              <option value="books" suppressHydrationWarning>{t('products.books')}</option>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg ${
                      page === p
                        ? "bg-accent text-white"
                        : "bg-surface border border-border hover:bg-surface-secondary"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
