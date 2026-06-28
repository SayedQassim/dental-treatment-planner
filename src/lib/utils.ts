import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DiscountType, LineItem } from './types';

export function treatedTeeth(items: LineItem[]): number[] {
  const set = new Set<number>();
  for (const item of items) for (const t of item.teeth) set.add(t);
  return [...set].sort((a, b) => a - b);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'BD'): string {
  return `${currency}${amount.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function calcSubtotal(items: LineItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function applyDiscount(subtotal: number, type: DiscountType, value: number): number {
  if (type === 'none' || !value) return subtotal;
  if (type === 'fixed_amount') return Math.max(0, subtotal - value);
  return Math.max(0, subtotal - (subtotal * value) / 100);
}

export function generateRefNo(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${yy}${mm}${dd}-${rand}`;
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
