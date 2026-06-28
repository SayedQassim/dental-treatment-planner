'use client';
import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Eraser } from 'lucide-react';
import { usePlanStore } from '@/lib/store';
import ToothChart from '@/components/tooth-chart/ToothChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TreatmentPicker from './TreatmentPicker';
import {
  applyDiscount,
  calcSubtotal,
  formatCurrency,
  treatedTeeth,
} from '@/lib/utils';
import type { DiscountType } from '@/lib/types';

export default function PlanEditor() {
  const plan = usePlanStore(s => s.plan);
  const providers = usePlanStore(s => s.providers);
  const clinic = usePlanStore(s => s.clinic);
  const setPlan = usePlanStore(s => s.setPlan);
  const toggleTooth = usePlanStore(s => s.toggleTooth);
  const clearTeeth = usePlanStore(s => s.clearTeeth);
  const removeLineItem = usePlanStore(s => s.removeLineItem);
  const updateLineItem = usePlanStore(s => s.updateLineItem);
  const resetPlan = usePlanStore(s => s.resetPlan);
  const [pickerOpen, setPickerOpen] = useState(false);

  const subtotal = calcSubtotal(plan.items);
  const finalTotal = applyDiscount(subtotal, plan.discountType, plan.discountValue);
  const treated = treatedTeeth(plan.items);

  return (
    <div className="space-y-5">
      <Section title="Patient">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-4 sm:col-span-3">
            <Label htmlFor="title">Title</Label>
            <Select
              id="title"
              value={plan.patientTitle}
              onChange={e => setPlan({ patientTitle: e.target.value })}
            >
              {['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Master'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </div>
          <div className="col-span-8 sm:col-span-9">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Patient name"
              value={plan.patientName}
              onChange={e => setPlan({ patientName: e.target.value })}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="ref">Ref No.</Label>
            <Input
              id="ref"
              value={plan.refNo}
              onChange={e => setPlan({ refNo: e.target.value })}
            />
          </div>
          <div className="col-span-6 sm:col-span-4">
            <Label htmlFor="provider">Provider</Label>
            <Select
              id="provider"
              value={plan.provider}
              onChange={e => setPlan({ provider: e.target.value })}
            >
              {providers.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={plan.planDate}
              onChange={e => setPlan({ planDate: e.target.value })}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Teeth"
        right={
          plan.selectedTeeth.length > 0 ? (
            <button
              type="button"
              onClick={clearTeeth}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Eraser className="h-3.5 w-3.5" /> Clear selection
            </button>
          ) : null
        }
      >
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <ToothChart
            selected={plan.selectedTeeth}
            treated={treated}
            onToggle={toggleTooth}
          />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <Legend swatch="#fde047" label="Selected for next treatment" />
            <Legend swatch="#fef3c7" label="Already on plan" />
            <span className="text-gray-400">
              {plan.selectedTeeth.length > 0
                ? `${plan.selectedTeeth.length} selected · add a treatment to attach them`
                : 'Click teeth to pick the ones for the next treatment'}
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Treatments"
        right={
          <Button size="sm" onClick={() => setPickerOpen(true)}>
            <Plus className="h-4 w-4" /> Add treatment
          </Button>
        }
      >
        {plan.items.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No treatments yet. Click teeth above and then add a treatment.
          </p>
        ) : (
          <div className="space-y-2">
            {plan.items.map(item => (
              <div
                key={item.id}
                className="rounded-md border border-gray-200 bg-white p-3 grid grid-cols-12 gap-2 items-end"
              >
                <div className="col-span-12 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {item.description}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1 -m-1"
                    aria-label="Remove treatment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="col-span-12 sm:col-span-5">
                  <Label className="text-xs">Teeth</Label>
                  <div className="text-xs text-gray-600 min-h-9 flex items-center px-2 rounded border border-gray-200 bg-gray-50">
                    {item.teeth.length > 0
                      ? item.teeth.join(', ')
                      : 'No teeth'}
                  </div>
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <Label className="text-xs">Unit price</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={e =>
                      updateLineItem(item.id, {
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={item.quantity}
                    onChange={e =>
                      updateLineItem(item.id, {
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="col-span-4 sm:col-span-2 text-right">
                  <Label className="text-xs">Total</Label>
                  <div className="h-9 flex items-center justify-end font-medium text-sm tabular-nums">
                    {formatCurrency(item.unitPrice * item.quantity, clinic.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Financials">
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-12 sm:col-span-4">
            <Label>Discount type</Label>
            <Select
              value={plan.discountType}
              onChange={e =>
                setPlan({ discountType: e.target.value as DiscountType })
              }
            >
              <option value="none">No discount</option>
              <option value="fixed_amount">Fixed amount</option>
              <option value="percentage">Percentage</option>
            </Select>
          </div>
          <div className="col-span-7 sm:col-span-4">
            <Label>Discount label</Label>
            <Input
              value={plan.discountLabel}
              onChange={e => setPlan({ discountLabel: e.target.value })}
              disabled={plan.discountType === 'none'}
              placeholder="e.g. Unipal Disc"
            />
          </div>
          <div className="col-span-5 sm:col-span-4">
            <Label>
              {plan.discountType === 'percentage' ? 'Discount %' : 'Amount'}
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={plan.discountValue}
              onChange={e =>
                setPlan({ discountValue: parseFloat(e.target.value) || 0 })
              }
              disabled={plan.discountType === 'none'}
            />
          </div>
        </div>
        <div className="mt-3 flex flex-col items-end text-sm tabular-nums space-y-1">
          <div>
            Subtotal:{' '}
            <span className="font-medium">{formatCurrency(subtotal, clinic.currency)}</span>
          </div>
          <div className="font-bold underline text-base">
            Grand total: {formatCurrency(finalTotal, clinic.currency)}
          </div>
        </div>
      </Section>

      <Section
        title="Consent text"
        right={
          <span className="text-xs text-gray-400">
            Auto-attached by category · editable
          </span>
        }
      >
        <Textarea
          value={plan.consentText}
          onChange={e => setPlan({ consentText: e.target.value })}
          rows={6}
          placeholder="Consent paragraphs will appear here as you add treatments."
        />
      </Section>

      <Section title="Signatures">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Guardian (if minor)</Label>
            <Input
              value={plan.guardianName}
              onChange={e => setPlan({ guardianName: e.target.value })}
            />
          </div>
          <div>
            <Label>Witness</Label>
            <Input
              value={plan.witnessName}
              onChange={e => setPlan({ witnessName: e.target.value })}
            />
          </div>
        </div>
      </Section>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => {
            if (confirm('Start a new blank plan? Current plan will be lost.')) {
              resetPlan();
            }
          }}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 sm:justify-start"
        >
          <RotateCcw className="h-4 w-4" /> Reset plan
        </button>
        <Button onClick={() => window.print()} className="h-11 sm:h-9">
          Print / Export PDF
        </Button>
      </div>

      <TreatmentPicker open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block w-3 h-3 rounded-sm border border-amber-700/40"
        style={{ background: swatch }}
      />
      {label}
    </span>
  );
}

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
          {title}
        </h3>
        {right}
      </div>
      {children}
    </section>
  );
}
