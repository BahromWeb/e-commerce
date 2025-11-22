"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { orderAPI } from "@/lib/api";
import { Order } from "@/lib/types";
import { Header } from "@/components/header";
import { useToast } from "@/components/ui/toast-provider";
import { PuffLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';
import { FaLongArrowAltLeft } from "react-icons/fa";


export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getById(Number(id));
      setOrder(response.data.data || null);
    } catch {
      showToast(t('orders.loadOrderFailed'), "error");
      router.push("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm(t('orders.confirmCancel'))) return;
    try {
      await orderAPI.cancel(Number(id));
      showToast(t('orders.cancelSuccess'), "success");
      fetchOrder();
    } catch {
      showToast(t('orders.cancelFailed'), "error");
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
        <button onClick={() => router.back()} className="mb-6 text-accent hover:underline">
         <FaLongArrowAltLeft /> {t('common.back')}
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">{t('orders.id')} #{order.id}</h1>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.customerName')}</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.customerEmail')}</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.orderDate')}</p>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{t('orders.status')}</p>
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
              </div>

              <h2 className="text-xl font-bold mb-4">{t('orders.orderItems')}</h2>
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-border">
                    <span>{item.productName} x {item.quantity}</span>
                    <span className="font-bold">${item.totalPrice.toFixed(2)}</span>
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
                <span className="font-bold text-lg text-accent">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>{t('orders.orderDate')}</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>

            {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
              <button onClick={handleCancel} className="btn-danger w-full mt-6">
                {t('orders.cancelOrder')}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
