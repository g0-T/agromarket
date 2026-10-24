// File: frontend/src/context/currency.context.tsx
// React context provider for managing real-time BCV exchange rates.

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import logger from '@/utils/logger';
import { getApiBaseUrl } from '@/utils/api-config';

// Typed for stronger safety during development
interface CurrencyContextValue {
  bcvRate: number;
  loading: boolean;
  error: string | null;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const API_URL = `${getApiBaseUrl()}/currency/rate`;

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [bcvRate, setBcvRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }

        const data = await res.json();

        if (data?.success && data?.rate) {
          setBcvRate(Number(data.rate));
          setError(null);
        } else {
          throw new Error(data?.message || 'Invalid response format');
        }
      } catch (err: any) {
        logger.error(err, { context: 'CurrencyContext' });
        setError('No se pudo sincronizar la tasa actual');
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  // Memoize the value to avoid unnecessary re-renders in the app
  const value = useMemo(() => ({
    bcvRate,
    loading,
    error
  }), [bcvRate, loading, error]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used inside a CurrencyProvider');
  }
  return context;
};