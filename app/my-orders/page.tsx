"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { orderAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Order } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";

export default function MyOrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getByEmail(user?.email || "");
      setOrders(response.data.data || []);
    } catch (error) {
      showToast("Failed to load orders", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">No orders yet</p>
            <button onClick={() => router.push("/products")} className="btn-primary">
              Start Shopping
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Items: {order.items.length}</p>
                    <p className="font-bold text-lg text-accent">${order.totalAmount}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="btn-secondary btn-sm"
                  >
                    View Details
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
