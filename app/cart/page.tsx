"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, removeFromCart, updateQuantity, clearCart } from "@/lib/store";
import { Header } from "@/components/header";
import { orderAPI } from "@/lib/api";
import { useToast } from "@/components/ui/toast-provider";
import { CreateOrderRequest } from "@/lib/types";
import { useTranslation } from 'react-i18next';
import { PuffLoader } from "react-spinners";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    const item = items.find(i => i.productId === productId);
    if (item?.product && quantity > item.product.stock) {
      showToast(t('cart.stockLimit', { stock: item.product.stock }), "warning");
      return;
    }
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    showToast(t('cart.itemRemoved'), "success");
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast(t('cart.loginFirst'), "warning");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      showToast(t('cart.empty'), "warning");
      return;
    }

    try {
      setIsLoading(true);
      const orderData: CreateOrderRequest = {
        customerName: user.username,
        customerEmail: user.email,
        orderItems: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await orderAPI.create(orderData);
      
      if (response.data.success) {
        dispatch(clearCart());
        showToast(t('cart.orderPlaced'), "success");
        router.push("/my-orders");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || t('cart.orderFailed');
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Header />
      <main className="page-container">
        <h1 className="section-title">{t('cart.cart')}</h1>

        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
            <p className="text-text-secondary mb-6">{t('cart.emptyMessage')}</p>
            <button
              onClick={() => router.push("/products")}
              className="btn-primary"
            >
              {t('cart.continue')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="card p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="bg-surface-secondary w-full sm:w-24 h-32 sm:h-24 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-3xl sm:text-3xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.product?.name}</h3>
                      <p className="text-text-secondary text-sm mb-2">
                        {t('cart.category')}: {item.product?.category}
                      </p>
                      <p className="text-accent font-bold text-lg">
                        ${item.product?.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2">
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-error hover:underline text-sm order-2 sm:order-1"
                      >
                        {t('cart.remove')}
                      </button>
                      <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-surface-secondary"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-border hover:bg-surface-secondary"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold order-3">
                        {t('cart.total')}: ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">{t('cart.orderSummary')}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t('cart.items')} ({items.length})</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{t('cart.subtotal')}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('cart.total')}</span>
                    <span className="text-accent">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isLoading ? <PuffLoader color="#ffffff" size={24} /> : t('cart.placeOrder')}
                </button>
                <button
                  onClick={() => router.push("/products")}
                  className="btn-secondary w-full mt-3"
                >
                  {t('cart.continue')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
