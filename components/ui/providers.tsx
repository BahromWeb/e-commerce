"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/store";
import { AppDispatch } from "@/lib/store";
import { ToastProvider } from "./toast-provider";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <InitializeAuth>{children}</InitializeAuth>
        </ToastProvider>
      </I18nextProvider>
    </Provider>
  );
}

function InitializeAuth({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        dispatch(setUser({ user: JSON.parse(user), token }));
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
