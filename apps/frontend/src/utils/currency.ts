// File: frontend/src/utils/currency.ts
// Utility helper functions used across frontend code.

// Format an amount as Venezuelan bolívares.
export const formatBS = (amount: number) => {
  if (amount == null || isNaN(amount)) return 'Bs. 0,00';
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format an amount using a currency code.
// Falls back to a simple string if the currency is unsupported.
export const formatCurrency = (amount: number, currency: string) => {
  if (amount == null || isNaN(amount)) return `${currency} 0`;

  const normalizedCurrency = (currency || 'USD').toUpperCase();
  const isVES = normalizedCurrency === 'VES';
  const locale = isVES ? 'es-VE' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unknown currencies
    return `${normalizedCurrency} ${amount.toLocaleString(locale, { minimumFractionDigits: 2 })}`;
  }
};

// Convert a USD amount into Venezuelan bolívares using a given rate.
export const convertToVES = (usdAmount: number, rate: number) => {
  if (!rate || isNaN(rate)) return 0;
  return usdAmount * rate;
};