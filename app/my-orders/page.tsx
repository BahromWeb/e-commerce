"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { orderAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Order } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";
import { PuffLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';

export default function MyOrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
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
      const response = await orderAPI.getByEmail(user?.email || "");
      setOrders(response.data.data || []);
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
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`badge ${
                      order.status === "DELIVERED"
                        ? "badge-success"
                        : order.status === "CANCELLED"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">{t('orders.items')}: {order.orderItems.length}</p>
                    <p className="font-bold text-lg text-accent">${order.totalAmount.toFixed(2)}</p>
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
