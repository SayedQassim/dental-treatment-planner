import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'BD'): string {
  return `${currency}${amount.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function calcTotal(items: Array<{ unitPrice: number; quantity: number }>): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function calcDiscounted(
  total: number,
  type: 'none' | 'fixed_amount' | 'percentage',
  value: number,
): number {
  if (type === 'none') return total;
  if (type === 'fixed_amount') return Math.max(0, total - value);
  return Math.max(0, total - (total * value) / 100);
}
