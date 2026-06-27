'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TreatmentPlanPDF from './TreatmentPlanPDF';
import type { TreatmentPlan, Clinic } from '@/lib/types';
import { FileDown } from 'lucide-react';

interface Props {
  plan: TreatmentPlan;
  clinic: Clinic;
}

export default function PDFDownloadButton({ plan, clinic }: Props) {
  const filename = `TreatmentPlan_${plan.patientName.replace(/\s+/g, '_')}_${plan.planDate}.pdf`;
  return (
    <PDFDownloadLink
      document={<TreatmentPlanPDF plan={plan} clinic={clinic} />}
      fileName={filename}
    >
      {({ loading }) => (
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <FileDown className="h-4 w-4" />
          {loading ? 'Preparing…' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
