"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { RootState } from "@/lib/store";
import { Header } from "@/components/header";
import { useToast } from "@/components/toast-provider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const profileSchema = yup.object().shape({
    name: yup.string().required(t('validation.required', { field: t('auth.name') })),
    email: yup
      .string()
      .email(t('validation.invalidEmail'))
      .required(t('validation.required', { field: t('auth.email') })),
    currentPassword: yup.string(),
    newPassword: yup.string().min(6, t('validation.passwordMin', { min: 6 })),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      // API call would go here
      showToast(t('profile.updateSuccess'), "success");
    } catch (error) {
      showToast(t('profile.updateFailed'), "error");
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
        <h1 className="section-title">{t('profile.my')}</h1>

        <div className="max-w-2xl">
          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-group">
                <label className="label">{t('auth.name')}</label>
                <input {...register("name")} type="text" className="input-field" />
                {errors.name && (
                  <p className="text-error text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="label">{t('auth.email')}</label>
                <input {...register("email")} type="email" className="input-field" />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="font-bold mb-4">{t('profile.changePassword')}</h3>

                <div className="form-group">
                  <label className="label">{t('profile.currentPassword')}</label>
                  <input
                    {...register("currentPassword")}
                    type="password"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label className="label">{t('profile.newPassword')}</label>
                  <input
                    {...register("newPassword")}
                    type="password"
                    className="input-field"
                  />
                  {errors.newPassword && (
                    <p className="text-error text-sm mt-1">{errors.newPassword.message}</p>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? t('profile.updating') : t('profile.update')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
