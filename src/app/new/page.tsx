'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ToothChart from '@/components/tooth-chart/ToothChart';
import TreatmentTable from '@/components/treatment/TreatmentTable';
import { usePlanStore } from '@/lib/store';
import type { Provider } from '@/lib/types';

const STEPS = ['Patient Info', 'Dental Chart', 'Treatments', 'Consent & Save'];
const TITLES = ['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Master'] as const;

export default function NewPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [currency, setCurrency] = useState('BD');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { form, selectedTeeth, setField, toggleTooth, addItem, updateItem, removeItem, syncConsentText, resetForm } = usePlanStore();

  useEffect(() => {
    resetForm();
    fetch('/api/providers').then(r => r.json()).then(setProviders).catch(() => {});
    fetch('/api/clinic').then(r => r.json()).then(c => { if (c?.currency) setCurrency(c.currency); }).catch(() => {});
  }, []);

  const defaultProvider = providers.find(p => p.id === form.providerId)?.name ?? '';

  const canAdvance = useCallback(() => {
    if (step === 0) return form.patientName.trim().length > 0 && form.providerId.length > 0;
    if (step === 2) return form.items.length > 0;
    return true;
  }, [step, form]);

  const handleNext = () => {
    if (step === 1) syncConsentText();
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleSave = async (status: 'draft' | 'finalised') => {
    setSaving(true);
    setError('');
    try {
      const provider = providers.find(p => p.id === form.providerId);
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          providerName: provider ? `${provider.title} ${provider.name}` : form.providerId,
          status,
          items: form.items,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { id } = await res.json();
      router.push(`/plan/${id}`);
    } catch (e) {
      setError('Failed to save plan. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                  i === step
                    ? 'bg-blue-600 text-white'
                    : i < step
                    ? 'bg-green-500 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-default'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </button>
              <span className={`text-sm hidden sm:block ${i === step ? 'font-semibold text-blue-600' : i < step ? 'text-green-600' : 'text-gray-400'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className={`h-px w-8 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {/* STEP 0: Patient Info */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-800">Patient Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>Title</Label>
                <Select value={form.patientTitle} onChange={e => setField('patientTitle', e.target.value as typeof form.patientTitle)}>
                  {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <Label>Patient Full Name <span className="text-red-500">*</span></Label>
                <Input
                  value={form.patientName}
                  onChange={e => setField('patientName', e.target.value)}
                  placeholder="e.g. Sayed Qasim Baqer"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Reference Number</Label>
                <Input
                  value={form.refNo}
                  onChange={e => setField('refNo', e.target.value)}
                  placeholder="e.g. 1003423"
                />
              </div>
              <div className="space-y-1">
                <Label>Plan Date</Label>
                <Input
                  type="date"
                  value={form.planDate}
                  onChange={e => setField('planDate', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Provider <span className="text-red-500">*</span></Label>
              {providers.length === 0 ? (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  No providers found. Please add providers in{' '}
                  <a href="/settings" className="underline font-medium">Settings</a> first.
                </p>
              ) : (
                <Select
                  value={form.providerId}
                  onChange={e => setField('providerId', e.target.value)}
                  placeholder="Select provider…"
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.title} {p.name}</option>
                  ))}
                </Select>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Dental Chart */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Dental Chart</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Select the affected teeth by clicking on them. Selected teeth will be highlighted.
              </p>
            </div>
            <ToothChart selected={selectedTeeth} onToggle={toggleTooth} />
            {selectedTeeth.length > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {selectedTeeth.length} {selectedTeeth.length === 1 ? 'tooth' : 'teeth'} selected:{' '}
                {[...selectedTeeth].sort((a, b) => a - b).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* STEP 2: Treatments */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Treatments & Pricing</h2>
              <p className="text-sm text-gray-500 mt-0.5">Add each treatment row. You can edit prices and quantities.</p>
            </div>
            <TreatmentTable
              items={form.items}
              selectedTeeth={selectedTeeth}
              defaultProvider={defaultProvider}
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
          </div>
        )}

        {/* STEP 3: Consent & Save */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Consent Text & Save</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                The consent text below has been pre-filled based on the treatments added. You can edit it.
              </p>
            </div>
            <div className="space-y-1">
              <Label>Informed Consent Text</Label>
              <Textarea
                value={form.consentText}
                onChange={e => setField('consentText', e.target.value)}
                rows={16}
                className="font-mono text-xs leading-relaxed"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save as Draft
              </Button>
              <Button onClick={() => handleSave('finalised')} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Finalise & View PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => step === 0 ? router.push('/') : setStep(s => s - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 && (
          <Button onClick={handleNext} disabled={!canAdvance()}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
