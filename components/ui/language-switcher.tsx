"use client";

import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uz' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg bg-surface border border-border text-blue-800 cursor-pointer hover:bg-surface-secondary text-sm font-medium"
    >
      {i18n.language === 'en' ? t('uzbek') : t('english')}
    </button>
  );
}
