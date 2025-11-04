import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

export interface LocaleItem {
  code: string;
  name: string;
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
export const useLocale = () => {
  const [locale, setLocale] = useState<LocaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const fetch = useFetchClient();
  const getLocales = async () => {
    try {
      setLoading(true);
      const { data: response }: { data: LocaleItem[] } = await fetch.get('/i18n/locales');
      if (response) {
        setLocale(response);
      }
    } catch (error) {
      console.log('failed to load locale', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLocales();
  }, []);
  return {
    locale,
    loading,
  };
};
