"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { cartAPI, productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Cart, Product } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";
import { useTranslation } from 'react-i18next';
import { PuffLoader } from "react-spinners";

interface CartProduct {
  productId: number;
  quantity: number;
  product?: Product;
}

interface OrderWithProducts extends Omit<Cart, 'products'> {
  products: CartProduct[];
  totalAmount?: number;
}

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderWithProducts[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/my-orders");
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Get all carts (Fake Store API)
      const response = await cartAPI.getAll();
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
      showToast(t('orders.loadOrdersFailed'), "error");
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
        <h1 className="section-title">{t('orders.allOrders')}</h1>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left p-4">{t('orders.orderId')}</th>
                <th className="text-left p-4">{t('orders.customer')}</th>
                <th className="text-left p-4">{t('orders.items')}</th>
                <th className="text-left p-4">{t('orders.amount')}</th>
                <th className="text-left p-4">{t('orders.date')}</th>
                <th className="text-left p-4">{t('orders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-surface-secondary">
                  <td className="p-4 font-mono text-sm">{order.id}</td>
                  <td className="p-4">User #{order.userId}</td>
                  <td className="p-4">{order.products.length} items</td>
                  <td className="p-4 font-bold">${order.totalAmount?.toFixed(2)}</td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="btn-secondary btn-sm"
                    >
                      {t('orders.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
