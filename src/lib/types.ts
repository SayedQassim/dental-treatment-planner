export type PatientTitle = 'Mr.' | 'Mrs.' | 'Miss' | 'Dr.' | 'Master';

export type DiscountType = 'none' | 'fixed_amount' | 'percentage';

export type PlanStatus = 'draft' | 'finalised';

export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar' | 'wisdom';

export interface ToothInfo {
  number: number;
  type: ToothType;
  jaw: 'upper' | 'lower';
  side: 'right' | 'left';
  name: string;
}

export interface TreatmentType {
  id: string;
  category: string;
  name: string;
  defaultPrice: number;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  tel: string;
  fax: string;
  currency: string;
  discountLabel: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  clinicId: string;
  name: string;
  title: string;
  isActive: boolean;
  createdAt: string;
}

export interface TreatmentItem {
  id: string;
  planId: string;
  toothNumbers: string[];
  treatmentName: string;
  unitPrice: number;
  quantity: number;
  providerName: string;
  dateCompleted?: string;
  sortOrder: number;
}

export interface TreatmentPlan {
  id: string;
  clinicId: string;
  patientName: string;
  patientTitle: PatientTitle;
  refNo: string;
  providerId: string;
  providerName: string;
  planDate: string;
  discountType: DiscountType;
  discountValue: number;
  discountLabel: string;
  consentText: string;
  status: PlanStatus;
  items: TreatmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentPlanFormData {
  patientTitle: PatientTitle;
  patientName: string;
  refNo: string;
  providerId: string;
  planDate: string;
  discountType: DiscountType;
  discountValue: number;
  discountLabel: string;
  consentText: string;
  items: (Omit<TreatmentItem, 'planId'> & { id: string })[];
}
