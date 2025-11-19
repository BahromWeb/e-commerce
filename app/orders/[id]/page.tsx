"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { orderAPI } from "@/lib/api";
import { Order } from "@/lib/types";
import { Header } from "@/components/header";
import { useToast } from "@/components/toast-provider";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getById(id as string);
      setOrder(response.data.data);
    } catch (error) {
      showToast("Failed to load order", "error");
      router.push("/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderAPI.cancel(id as string);
      showToast("Order cancelled successfully", "success");
      router.push("/orders");
    } catch (error) {
      showToast("Failed to cancel order", "error");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <>
      <Header />
      <main className="page-container">
        <button onClick={() => router.back()} className="mb-6 text-accent hover:underline">
          ← Back
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-text-secondary text-sm">Customer Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm">Status</p>
                  <span
                    className={`badge ${
                      order.status === "COMPLETED"
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

              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-border">
                    <span>{item.productName} x {item.quantity}</span>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold text-lg text-accent">${order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Created</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {order.status === "PENDING" && (
              <button onClick={handleCancel} className="btn-danger w-full mt-6">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
