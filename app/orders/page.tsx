"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { orderAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { Order } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/my-orders");
      return;
    }
    fetchOrders();
  }, [user, router, page]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderAPI.getAll(page, 10);
      setOrders(response.data.data?.orders || []);
      setTotal(response.data.data?.total || 0);
    } catch (error) {
      showToast("Failed to load orders", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      showToast("Order status updated", "success");
      fetchOrders();
    } catch (error) {
      showToast("Failed to update order", "error");
    }
  };

  const pageCount = Math.ceil(total / 10);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">All Orders</h1>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-surface-secondary">
                  <td className="p-4 font-mono text-sm">{order.id}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4 font-bold">${order.totalAmount}</td>
                  <td className="p-4">
                    {order.status === "PENDING" ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    ) : (
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
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="btn-secondary btn-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="flex justify-center gap-2 mt-6">
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
      </main>
    </>
  );
}
