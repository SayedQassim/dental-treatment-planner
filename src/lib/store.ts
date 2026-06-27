'use client';
import { create } from 'zustand';
import type { TreatmentPlanFormData, PatientTitle, DiscountType } from './types';
import { generateId } from './utils';
import { getConsentText } from './consent-texts';
import { CONSENT_TEXTS } from './consent-texts';
import { getCategoryForTreatment } from './treatment-types';

interface PlanStore {
  form: TreatmentPlanFormData;
  selectedTeeth: number[];
  setField: <K extends keyof TreatmentPlanFormData>(key: K, value: TreatmentPlanFormData[K]) => void;
  toggleTooth: (num: number) => void;
  selectTeeth: (nums: number[]) => void;
  clearTeeth: () => void;
  addItem: (item: Omit<TreatmentPlanFormData['items'][number], 'sortOrder'>) => void;
  updateItem: (id: string, patch: Partial<TreatmentPlanFormData['items'][number]>) => void;
  removeItem: (id: string) => void;
  reorderItems: (items: TreatmentPlanFormData['items']) => void;
  syncConsentText: () => void;
  resetForm: () => void;
  loadPlan: (plan: TreatmentPlanFormData) => void;
}

const defaultForm = (): TreatmentPlanFormData => ({
  patientTitle: 'Mr.' as PatientTitle,
  patientName: '',
  refNo: '',
  providerId: '',
  planDate: new Date().toISOString().split('T')[0],
  discountType: 'none' as DiscountType,
  discountValue: 0,
  discountLabel: 'Discount',
  consentText: CONSENT_TEXTS.Restorative,
  items: [],
});

export const usePlanStore = create<PlanStore>((set, get) => ({
  form: defaultForm(),
  selectedTeeth: [],

  setField: (key, value) =>
    set(s => ({ form: { ...s.form, [key]: value } })),

  toggleTooth: (num) =>
    set(s => ({
      selectedTeeth: s.selectedTeeth.includes(num)
        ? s.selectedTeeth.filter(t => t !== num)
        : [...s.selectedTeeth, num],
    })),

  selectTeeth: (nums) => set({ selectedTeeth: nums }),
  clearTeeth: () => set({ selectedTeeth: [] }),

  addItem: (item) =>
    set(s => {
      const newItem = { ...item, id: generateId(), sortOrder: s.form.items.length };
      const newItems = [...s.form.items, newItem];
      return { form: { ...s.form, items: newItems } };
    }),

  updateItem: (id, patch) =>
    set(s => ({
      form: {
        ...s.form,
        items: s.form.items.map(i => i.id === id ? { ...i, ...patch } : i),
      },
    })),

  removeItem: (id) =>
    set(s => ({
      form: {
        ...s.form,
        items: s.form.items.filter(i => i.id !== id),
      },
    })),

  reorderItems: (items) =>
    set(s => ({ form: { ...s.form, items } })),

  syncConsentText: () => {
    const { form } = get();
    const categories = [...new Set(form.items.map(i => getCategoryForTreatment(i.treatmentName)))];
    const text = getConsentText(categories);
    set(s => ({ form: { ...s.form, consentText: text } }));
  },

  resetForm: () => set({ form: defaultForm(), selectedTeeth: [] }),

  loadPlan: (plan) => set({ form: plan, selectedTeeth: [] }),
}));
