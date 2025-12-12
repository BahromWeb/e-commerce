"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useDispatch } from "react-redux";
import { loadCart } from "@/lib/store";
import { AppDispatch } from "@/lib/store";
import { ConfigProvider, message } from 'antd';

function ClientProviders({ children }: { children: ReactNode }) {
  // Configure message globally for React 18
  message.config({
    top: 100,
    duration: 3,
    maxCount: 3,
  });

  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#9333ea',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            colorInfo: '#3b82f6',
            borderRadius: 12,
            fontSize: 16,
          },
        }}
      >
        <InitializeAuth>{children}</InitializeAuth>
      </ConfigProvider>
    </Provider>
  );
}

function InitializeAuth({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load cart from localStorage
    const cart = localStorage.getItem("cart");
    if (cart) {
      try {
        dispatch(loadCart(JSON.parse(cart)));
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
