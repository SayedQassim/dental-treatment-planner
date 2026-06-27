'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { FileDown, Edit3, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ToothChart from '@/components/tooth-chart/ToothChart';
import TreatmentTable from '@/components/treatment/TreatmentTable';
import { formatDate, formatCurrency, calcTotal, calcDiscounted } from '@/lib/utils';
import { usePlanStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import type { TreatmentPlan, Clinic } from '@/lib/types';

const PDFDownloadButton = dynamic(() => import('@/components/pdf/PDFDownloadButton'), { ssr: false });

interface RawItem {
  id: string;
  plan_id: string;
  tooth_numbers: string[];
  treatment_name: string;
  unit_price: number;
  quantity: number;
  provider_name: string;
  date_completed?: string;
  sort_order: number;
}

function rawToItem(r: RawItem) {
  return {
    id: r.id,
    planId: r.plan_id,
    toothNumbers: r.tooth_numbers,
    treatmentName: r.treatment_name,
    unitPrice: r.unit_price,
    quantity: r.quantity,
    providerName: r.provider_name,
    dateCompleted: r.date_completed,
    sortOrder: r.sort_order,
  };
}

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<TreatmentPlan | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { form, selectedTeeth, setField, toggleTooth, addItem, updateItem, removeItem, syncConsentText, loadPlan } = usePlanStore();

  useEffect(() => {
    Promise.all([
      fetch(`/api/plans/${id}`).then(r => r.json()),
      fetch('/api/clinic').then(r => r.json()).catch(() => null),
    ]).then(([rawPlan, clinicData]) => {
      const items = (rawPlan.treatment_items ?? []).map((i: RawItem) => rawToItem(i));
      const p: TreatmentPlan = {
        id: rawPlan.id,
        clinicId: rawPlan.clinic_id,
        patientName: rawPlan.patient_name,
        patientTitle: rawPlan.patient_title,
        refNo: rawPlan.ref_no,
        providerId: rawPlan.provider_id,
        providerName: rawPlan.provider_name,
        planDate: rawPlan.plan_date,
        discountType: rawPlan.discount_type,
        discountValue: rawPlan.discount_value,
        discountLabel: rawPlan.discount_label,
        consentText: rawPlan.consent_text,
        status: rawPlan.status,
        items,
        createdAt: rawPlan.created_at,
        updatedAt: rawPlan.updated_at,
      };
      setPlan(p);
      loadPlan({
        patientTitle: p.patientTitle,
        patientName: p.patientName,
        refNo: p.refNo,
        providerId: p.providerId,
        planDate: p.planDate,
        discountType: p.discountType,
        discountValue: p.discountValue,
        discountLabel: p.discountLabel,
        consentText: p.consentText,
        items: items.map((i: ReturnType<typeof rawToItem>) => ({ ...i, id: i.id, sortOrder: i.sortOrder })),
      });
      setClinic(clinicData);
      setLoading(false);
    }).catch(() => { setError('Could not load plan.'); setLoading(false); });
  }, [id]);

  const allSelectedTeeth = [...new Set((plan?.items ?? []).flatMap(i => i.toothNumbers).map(Number))];

  const handleSave = async (status?: string) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          providerName: plan?.providerName ?? form.providerId,
          status: status ?? plan?.status,
          items: form.items,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Refresh
      const updated = await fetch(`/api/plans/${id}`).then(r => r.json());
      const items = (updated.treatment_items ?? []).map((i: RawItem) => rawToItem(i));
      setPlan(p => p ? {
        ...p,
        ...form,
        providerName: p.providerName,
        status: (status ?? p.status) as 'draft' | 'finalised',
        items,
      } : p);
      setEditing(false);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  if (!plan) return (
    <div className="text-center py-20 text-gray-500">{error || 'Plan not found.'}</div>
  );

  const total = calcTotal(plan.items);
  const final = calcDiscounted(total, plan.discountType, plan.discountValue);
  const currency = clinic?.currency ?? 'BD';

  const defaultClinic: Clinic = clinic ?? {
    id: '', name: 'Dental Centre', address: '', tel: '', fax: '',
    currency: 'BD', discountLabel: 'Discount', createdAt: '',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4" /> All Plans
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            {plan.patientTitle} {plan.patientName}
          </h1>
          <p className="text-sm text-gray-500">
            Ref: {plan.refNo} · {plan.providerName} · {formatDate(plan.planDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            plan.status === 'finalised' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {plan.status === 'finalised' ? 'Finalised' : 'Draft'}
          </span>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit3 className="h-4 w-4" /> Edit
            </Button>
          )}
          <PDFDownloadButton plan={plan} clinic={defaultClinic} />
        </div>
      </div>

      {/* Summary card */}
      {!editing && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Treatments', value: plan.items.length.toString() },
            { label: 'Teeth Treated', value: allSelectedTeeth.length.toString() },
            { label: 'Total Cost', value: formatCurrency(total, currency) },
            { label: 'After Discount', value: formatCurrency(final, currency) },
          ].map(card => (
            <div key={card.label} className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-base font-semibold text-gray-800">Edit Dental Chart</h2>
          <ToothChart selected={selectedTeeth} onToggle={toggleTooth} />

          <TreatmentTable
            items={form.items}
            selectedTeeth={selectedTeeth}
            defaultProvider={plan.providerName}
            currency={currency}
            discountType={form.discountType}
            discountValue={form.discountValue}
            discountLabel={form.discountLabel}
            onAdd={addItem}
            onUpdate={updateItem}
            onRemove={removeItem}
            onDiscountTypeChange={v => setField('discountType', v)}
            onDiscountValueChange={v => setField('discountValue', v)}
            onDiscountLabelChange={v => setField('discountLabel', v)}
          />

          <div className="space-y-1">
            <Label>Consent Text</Label>
            <Textarea
              value={form.consentText}
              onChange={e => setField('consentText', e.target.value)}
              rows={12}
              className="font-mono text-xs"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
            <Button onClick={() => handleSave('finalised')} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Finalise
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Read-only chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dental Chart</h3>
            <ToothChart selected={allSelectedTeeth} onToggle={() => {}} readOnly />
          </div>

          {/* Treatment table read-only */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tooth #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Treatment</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {plan.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-gray-700">{item.toothNumbers.join(', ')}</td>
                    <td className="px-4 py-3 text-gray-600">{item.treatmentName}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-600">{formatCurrency(item.unitPrice, currency)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{formatCurrency(item.unitPrice * item.quantity, currency)}</td>
                    <td className="px-4 py-3 text-gray-600">{item.providerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-sm space-y-1 text-right">
              <p className="text-gray-600">Total: <span className="font-semibold text-gray-900">{formatCurrency(total, currency)}</span></p>
              {plan.discountType !== 'none' && (
                <p className="font-bold text-blue-700 underline">
                  Total After {plan.discountLabel}: {formatCurrency(final, currency)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finalise from view mode */}
      {!editing && plan.status === 'draft' && (
        <Button onClick={() => handleSave('finalised')} disabled={saving}>
          <CheckCircle className="h-4 w-4" /> Finalise Plan
        </Button>
      )}
    </div>
  );
}
