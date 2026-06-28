'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ClinicProfile,
  ConsentTemplate,
  DiscountType,
  LineItem,
  Plan,
  Provider,
} from './types';
import { DEFAULT_CONSENT_TEMPLATES } from './consent-templates';
import { TREATMENT_TYPES, getTreatmentById } from './treatment-types';
import { generateRefNo, newId, todayISO } from './utils';

interface PlanStore {
  clinic: ClinicProfile;
  providers: Provider[];
  priceList: Record<string, number>;
  consentTemplates: ConsentTemplate[];
  plan: Plan;

  setClinic: (partial: Partial<ClinicProfile>) => void;
  setProviders: (providers: Provider[]) => void;
  setPriceOverride: (treatmentId: string, price: number | null) => void;
  setConsentTemplate: (id: string, body: string) => void;

  setPlan: (partial: Partial<Plan>) => void;
  toggleTooth: (num: number) => void;
  clearTeeth: () => void;
  addLineItem: (treatmentId: string) => void;
  updateLineItem: (id: string, partial: Partial<LineItem>) => void;
  removeLineItem: (id: string) => void;
  resetPlan: () => void;
  getUnitPrice: (treatmentId: string) => number;
}

const DEFAULT_CLINIC: ClinicProfile = {
  name: 'Dr. Shahla Dental Centre',
  addressLines: ['Building 123, Road 45, Manama', 'Kingdom of Bahrain'],
  tel: '+973 1700 0000',
  fax: '',
  currency: 'BD',
  defaultDiscountLabel: 'Unipal Disc',
  validityMonths: 3,
};

const DEFAULT_PROVIDERS: Provider[] = [
  { id: newId(), name: 'Dr. Shahla' },
];

function emptyPlan(): Plan {
  return {
    patientTitle: 'Mr.',
    patientName: '',
    refNo: generateRefNo(),
    provider: 'Dr. Shahla',
    planDate: todayISO(),
    selectedTeeth: [],
    items: [],
    discountType: 'none',
    discountValue: 0,
    discountLabel: 'Unipal Disc',
    consentText: '',
    guardianName: '',
    witnessName: '',
  };
}

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      clinic: DEFAULT_CLINIC,
      providers: DEFAULT_PROVIDERS,
      priceList: {},
      consentTemplates: DEFAULT_CONSENT_TEMPLATES,
      plan: emptyPlan(),

      setClinic: partial =>
        set(s => ({ clinic: { ...s.clinic, ...partial } })),

      setProviders: providers => set({ providers }),

      setPriceOverride: (treatmentId, price) =>
        set(s => {
          const next = { ...s.priceList };
          if (price == null || Number.isNaN(price)) delete next[treatmentId];
          else next[treatmentId] = price;
          return { priceList: next };
        }),

      setConsentTemplate: (id, body) =>
        set(s => ({
          consentTemplates: s.consentTemplates.map(t =>
            t.id === id ? { ...t, body } : t,
          ),
        })),

      setPlan: partial => set(s => ({ plan: { ...s.plan, ...partial } })),

      toggleTooth: num =>
        set(s => {
          const has = s.plan.selectedTeeth.includes(num);
          return {
            plan: {
              ...s.plan,
              selectedTeeth: has
                ? s.plan.selectedTeeth.filter(n => n !== num)
                : [...s.plan.selectedTeeth, num].sort((a, b) => a - b),
            },
          };
        }),

      clearTeeth: () => set(s => ({ plan: { ...s.plan, selectedTeeth: [] } })),

      getUnitPrice: treatmentId => {
        const override = get().priceList[treatmentId];
        if (override != null) return override;
        return getTreatmentById(treatmentId)?.defaultPrice ?? 0;
      },

      addLineItem: treatmentId => {
        const t = getTreatmentById(treatmentId);
        if (!t) return;
        const selected = get().plan.selectedTeeth;
        const unitPrice = get().getUnitPrice(treatmentId);
        const quantity = selected.length > 0 ? selected.length : 1;
        const item: LineItem = {
          id: newId(),
          teeth: [...selected],
          treatmentId,
          description: t.name,
          unitPrice,
          quantity,
          provider: get().plan.provider,
          dateCompleted: '',
        };
        set(s => {
          const existingCategories = new Set(
            s.plan.items.map(it => {
              const tt = TREATMENT_TYPES.find(x => x.id === it.treatmentId);
              return tt?.category;
            }),
          );
          let consentText = s.plan.consentText;
          if (!existingCategories.has(t.category)) {
            const tpl = s.consentTemplates.find(
              c => c.category === t.category,
            );
            if (tpl) {
              consentText = consentText
                ? `${consentText}\n\n${tpl.body}`
                : tpl.body;
            }
          }
          return {
            plan: {
              ...s.plan,
              items: [...s.plan.items, item],
              consentText,
              // Clear the picker so the next add starts fresh.
              selectedTeeth: [],
            },
          };
        });
      },

      updateLineItem: (id, partial) =>
        set(s => ({
          plan: {
            ...s.plan,
            items: s.plan.items.map(i =>
              i.id === id ? { ...i, ...partial } : i,
            ),
          },
        })),

      removeLineItem: id =>
        set(s => ({
          plan: { ...s.plan, items: s.plan.items.filter(i => i.id !== id) },
        })),

      resetPlan: () => set({ plan: emptyPlan() }),
    }),
    {
      name: 'dental-plan-store-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        clinic: state.clinic,
        providers: state.providers,
        priceList: state.priceList,
        consentTemplates: state.consentTemplates,
        plan: state.plan,
      }),
    },
  ),
);
