"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { cartAPI, productAPI } from "@/lib/api";
import { Header } from "@/components/header";
import { useToast } from "@/components/ui/toast-provider";
import { useTranslation } from 'react-i18next';
import { Cart, Product } from "@/lib/types";
import { PuffLoader } from "react-spinners";

interface OrderWithTotal extends Cart {
  totalAmount: number;
}

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: OrderWithTotal[];
}

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role?.toUpperCase() !== "ADMIN") {
      router.push("/products");
      return;
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [cartsRes, productsRes] = await Promise.all([
        cartAPI.getAll(),
        productAPI.getAll(),
      ]);

      const carts = cartsRes.data || [];
      const products = productsRes.data || [];

      // Create a map of product prices
      const productPriceMap = products.reduce((map: Record<number, number>, product: Product) => {
        map[product.id] = product.price;
        return map;
      }, {});

      // Calculate total amount for each cart
      const ordersWithTotals = carts.map((cart) => {
        const totalAmount = cart.products.reduce((sum, item) => {
          return sum + (productPriceMap[item.productId] || 0) * item.quantity;
        }, 0);
        return { ...cart, totalAmount };
      });

      const totalRevenue = ordersWithTotals.reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalOrders: carts.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: ordersWithTotals.slice(0, 5),
      });
    } catch {
      showToast(t('dashboard.loadFailed'), "error");
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
        <h1 className="section-title">{t('dashboard.admin')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">{t('dashboard.totalOrders')}</h3>
            <p className="text-3xl font-bold text-accent">{stats.totalOrders}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">{t('dashboard.totalProducts')}</h3>
            <p className="text-3xl font-bold text-accent">{stats.totalProducts}</p>
          </div>
          <div className="card p-6">
            <h3 className="text-text-secondary text-sm font-medium mb-2">{t('dashboard.totalRevenue')}</h3>
            <p className="text-3xl font-bold text-accent">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.recentOrders')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2">{t('dashboard.orderId')}</th>
                  <th className="text-left py-2">{t('dashboard.customer')}</th>
                  <th className="text-left py-2">{t('dashboard.amount')}</th>
                  <th className="text-left py-2">{t('orders.date')}</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-surface-secondary">
                    <td className="py-3">{order.id}</td>
                    <td className="py-3">User #{order.userId}</td>
                    <td className="py-3">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 text-text-secondary">
                      {new Date(order.date).toLocaleDateString()}
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
