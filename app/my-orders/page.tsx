"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { cartAPI, productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Cart, Product } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";
import { PuffLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';

interface CartProduct {
  productId: number;
  quantity: number;
  product?: Product;
}

interface OrderWithProducts extends Omit<Cart, 'products'> {
  products: CartProduct[];
  totalAmount?: number;
}

export default function MyOrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Get carts for user (Fake Store API uses userId 1-10)
      const response = await cartAPI.getByUser(user?.id || 1);
      const carts = response.data || [];
      
      // Fetch product details for each cart item
      const ordersWithProducts: OrderWithProducts[] = await Promise.all(
        carts.map(async (cart) => {
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
          return { ...cart, products: productsWithDetails, totalAmount };
        })
      );
      
      setOrders(ordersWithProducts);
    } catch {
      showToast(t('orders.loadFailed'), "error");
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

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">{t('orders.my')}</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">{t('orders.noOrders')}</p>
            <button onClick={() => router.push("/products")} className="btn-primary">
              {t('orders.startShopping')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6 cursor-pointer hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-text-secondary text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="badge badge-success">
                    DELIVERED
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">{t('orders.items')}: {order.products.length}</p>
                    <p className="font-bold text-lg text-accent">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="btn-secondary btn-sm"
                  >
                    {t('orders.viewDetails')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
