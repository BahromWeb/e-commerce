"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { productAPI } from "@/lib/api";
import { Product } from "@/lib/types";
import { Header } from "@/components/header";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/store";
import { RootState } from "@/lib/store";
import { useToast } from "@/components/ui/toast-provider";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { PuffLoader } from "react-spinners";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
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
      showToast(t('products.loadProductFailed'), "error");
      router.push("/products");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="page-container">
          <div className="flex justify-center items-center min-h-[50vh]">
            <PuffLoader color="#6366f1" size={80} />
          </div>
        </main>
      </>
    );
  }
  if (!product) {
    return (
      <>
        <Header />
        <main className="page-container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">{t('products.productNotFound')}</h2>
            <button onClick={() => router.push("/products")} className="btn-primary">
              {t('products.backToProducts')}
            </button>
          </div>
        </main>
      </>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      showToast(t('products.loginToAdd'), "warning");
      return;
    }
    dispatch(addToCart({ product, quantity }));
    showToast(t('products.addedToCart'), "success");
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <button onClick={() => router.back()} className="mb-6 text-accent hover:underline">
          <p className="flex gap-2 items-center justify-center px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-3xl"><FaLongArrowAltLeft />{t('common.back')}</p>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white h-96 rounded-lg flex items-center justify-center p-8">
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
              className="object-contain h-full w-auto"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl text-accent font-bold mb-4">${product.price.toFixed(2)}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <span className="badge badge-success">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-yellow-500">
                ⭐ {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            <p className="text-text-secondary mb-6">{product.description}</p>

            <div className="space-y-4">
              <div>
                <label className="label">{t('products.quantity')}</label>
                <input
                  type="number"
                  min="1"
                  max={99}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(99, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                  className="input-field w-full"
                />
              </div>
              <button onClick={handleAddToCart} className="btn-primary w-full">
                {t('products.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
