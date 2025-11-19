"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { orderAPI, productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { useToast } from "@/components/ui/toast-provider";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/products");
      return;
    }
    fetchStats();
  }, [user, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        orderAPI.getAll(1, 100),
        productAPI.getAll(1, 100),
      ]);

      const orders = ordersRes.data.data?.orders || [];
      const products = productsRes.data.data?.products || [];

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      showToast("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-accent">{stats.totalOrders}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-accent">{stats.totalProducts}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-accent">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-surface-secondary">
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">{order.email}</td>
                    <td className="py-3">${order.totalAmount}</td>
                    <td className="py-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
