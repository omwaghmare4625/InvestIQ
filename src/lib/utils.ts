import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompactCurrency(value: number, currency: string = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function getCurrencySymbol(currency: string = 'INR') {
  return currency === 'INR' ? '₹' : '$';
}

const EXCHANGE_RATE = 83; // 1 USD = 83 INR

export function convertValue(value: number, from: string, to: string) {
  if (from === to) return value;
  if (from === 'INR' && to === 'USD') return value / EXCHANGE_RATE;
  if (from === 'USD' && to === 'INR') return value * EXCHANGE_RATE;
  return value;
}
