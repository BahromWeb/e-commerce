"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authAPI } from "@/lib/api";
import { setUser } from "@/lib/store";
import { Header } from "@/components/header";
import { AppDispatch } from "@/lib/store";
import { useDispatch as useReduxDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/components/ui/toast-provider";

export default function RegisterPage() {
  const dispatch = useReduxDispatch<AppDispatch>();
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = yup.object().shape({
    name: yup.string().required(t('validation.required', { field: t('auth.name') })),
    email: yup
      .string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required', { field: t('auth.email') })),
    password: yup
      .string()
      .min(6, t('validation.passwordMin', { min: 6 }))
      .required(t('validation.required', { field: t('auth.password') })),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t('validation.passwordMismatch'))
      .required(t('validation.required', { field: t('auth.confirmPassword') })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(
        data.email,
        data.password,
        data.name
      );

      if (response.data.data) {
        const { token, user } = response.data.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser({ user, token }));
        showToast(t('auth.registrationSuccess'), "success");
        router.push("/products");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || t('auth.registrationFailed');
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="page-container min-h-screen flex items-center justify-center">
        <div className="card w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">{t('auth.register')}</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label className="label">{t('auth.name')}</label>
              <input
                {...register("name")}
                type="text"
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-error text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.password')}</label>
              <input
                {...register("password")}
                type="password"
                className="input-field"
                placeholder="••••••"
              />
              {errors.password && (
                <p className="text-error text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="label">{t('auth.confirmPassword')}</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="input-field"
                placeholder="••••••"
              />
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? t('auth.creatingAccount') : t('auth.register')}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-6">
            {t('auth.haveAccount')}{" "}
            <Link href="/login" className="text-accent hover:underline">
              {t('auth.loginHere')}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
