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

export type DiscountType = 'none' | 'fixed_amount' | 'percentage';

export interface ClinicProfile {
  name: string;
  addressLines: string[];
  tel: string;
  fax: string;
  currency: string;
  defaultDiscountLabel: string;
  validityMonths: number;
}

export interface Provider {
  id: string;
  name: string;
}

export interface LineItem {
  id: string;
  teeth: number[];
  treatmentId: string;
  description: string;
  unitPrice: number;
  quantity: number;
  provider: string;
  dateCompleted: string;
}

export interface Plan {
  patientTitle: string;
  patientName: string;
  refNo: string;
  provider: string;
  planDate: string;
  selectedTeeth: number[];
  items: LineItem[];
  discountType: DiscountType;
  discountValue: number;
  discountLabel: string;
  consentText: string;
  guardianName: string;
  witnessName: string;
}

export interface ConsentTemplate {
  id: string;
  category: string;
  label: string;
  body: string;
}
