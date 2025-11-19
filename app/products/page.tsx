"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";
import { useToast } from "@/components/toast-provider";

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, category]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll(page, 12);
      setProducts(response.data.data?.products || []);
      setTotal(response.data.data?.total || 0);
    } catch (error) {
      showToast("Failed to load products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await productAPI.search(searchTerm, category);
      setProducts(response.data.data || []);
      setPage(1);
    } catch (error) {
      showToast("Search failed", "error");
    }
  };

  const pageCount = Math.ceil(total / 12);

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">Products</h1>

        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="input-field flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field md:w-40"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
            </select>
            <button type="submit" className="btn-primary">
              Search
            </button>
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => router.push("/products/new")}
                className="btn-primary"
              >
                Add Product
              </button>
            )}
          </form>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No products found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pageCount > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg ${
                      page === p
                        ? "bg-accent text-white"
                        : "bg-surface border border-border hover:bg-surface-secondary"
                    }`}
                  >
                    {p}
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
