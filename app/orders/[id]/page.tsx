"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { cartAPI, productAPI } from "@/lib/api";
import { Cart, Product } from "@/lib/types";
import { Header } from "@/components/header";
import { useToast } from "@/components/ui/toast-provider";
import { PuffLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';
import { FaLongArrowAltLeft } from "react-icons/fa";
import Image from "next/image";

interface CartProduct {
  productId: number;
  quantity: number;
  product?: Product;
}

interface OrderWithProducts extends Omit<Cart, 'products'> {
  products: CartProduct[];
  totalAmount?: number;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getById(Number(id));
      const cart = response.data;
      
      if (cart) {
        // Fetch product details for each cart item
        const productsWithDetails: CartProduct[] = await Promise.all(
          cart.products.map(async (item) => {
            try {
              const productResponse = await productAPI.getById(item.productId);
              return { ...item, product: productResponse.data };
            } catch {
              return { productId: item.productId, quantity: item.quantity };
            }
          })
        );
        const totalAmount = productsWithDetails.reduce((sum, item) => {
          return sum + (item.product?.price || 0) * item.quantity;
        }, 0);
        setOrder({ ...cart, products: productsWithDetails, totalAmount });
      }
    } catch {
      showToast(t('orders.loadOrderFailed'), "error");
      router.push("/orders");
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
  if (!order) {
    return (
      <>
        <Header />
        <main className="page-container">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">{t('orders.orderNotFound')}</h2>
            <button onClick={() => router.push("/my-orders")} className="btn-primary">
              {t('orders.backToOrders')}
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <button onClick={() => router.back()} className="mb-6 text-accent hover:underline flex items-center gap-2">
          <FaLongArrowAltLeft /> {t('common.back')}
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">{t('orders.id')} #{order.id}</h1>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.customer')}</p>
                  <p className="font-medium">User #{order.userId}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.orderDate')}</p>
                  <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.status')}</p>
                  <span className="badge badge-success">DELIVERED</span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4">{t('orders.orderItems')}</h2>
              <div className="space-y-4 mb-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-border">
                    {item.product?.image && (
                      <Image
                        src={item.product.image}
                        alt={item.product.title || 'Product'}
                        width={60}
                        height={60}
                        className="object-contain rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.title || `Product #${item.productId}`}</p>
                      <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">{t('orders.orderSummary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{t('orders.totalAmount')}</span>
                <span className="font-bold text-lg text-accent">${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>{t('orders.orderDate')}</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>{t('orders.items')}</span>
                <span>{order.products.length} items</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
