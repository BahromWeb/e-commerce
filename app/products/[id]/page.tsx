"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { Header } from "@/components/header";
import { useToast } from "@/components/toast-provider";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/store";
import { RootState } from "@/lib/store";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getById(id as string);
      setProduct(response.data.data);
    } catch (error) {
      showToast("Failed to load product", "error");
      router.push("/products");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    if (!user) {
      showToast("Please login first", "warning");
      return;
    }
    dispatch(addToCart({ product, quantity }));
    showToast(`Added to cart!`, "success");
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <button onClick={() => router.back()} className="mb-6 text-accent hover:underline">
          ← Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface-secondary h-96 rounded-lg flex items-center justify-center">
            <div className="text-8xl">📦</div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-accent font-bold mb-4">${product.price}</p>
            <p className="text-text-secondary mb-6">{product.description}</p>

            <div className="mb-6">
              <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-error"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                    }
                    className="input-field w-full"
                  />
                </div>
                <button onClick={handleAddToCart} className="btn-primary w-full">
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
