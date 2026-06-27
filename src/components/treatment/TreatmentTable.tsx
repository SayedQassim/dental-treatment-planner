'use client';
import { useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddTreatmentModal from './AddTreatmentModal';
import type { TreatmentPlanFormData } from '@/lib/types';
import { formatCurrency, calcTotal, calcDiscounted } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TreatmentTableProps {
  items: TreatmentPlanFormData['items'];
  selectedTeeth: number[];
  defaultProvider: string;
  currency: string;
  discountType: TreatmentPlanFormData['discountType'];
  discountValue: number;
  discountLabel: string;
  onAdd: (item: Omit<TreatmentPlanFormData['items'][number], 'sortOrder'>) => void;
  onUpdate: (id: string, patch: Partial<TreatmentPlanFormData['items'][number]>) => void;
  onRemove: (id: string) => void;
  onDiscountTypeChange: (v: TreatmentPlanFormData['discountType']) => void;
  onDiscountValueChange: (v: number) => void;
  onDiscountLabelChange: (v: string) => void;
}

export default function TreatmentTable({
  items, selectedTeeth, defaultProvider, currency,
  discountType, discountValue, discountLabel,
  onAdd, onUpdate, onRemove,
  onDiscountTypeChange, onDiscountValueChange, onDiscountLabelChange,
}: TreatmentTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TreatmentPlanFormData['items'][number] | null>(null);

  const total = calcTotal(items);
  const discounted = calcDiscounted(total, discountType, discountValue);
  const hasDiscount = discountType !== 'none';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">Treatment Items</h3>
        <Button size="sm" onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <PlusCircle className="h-4 w-4" /> Add Treatment
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          No treatments added yet. Click "Add Treatment" to begin.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Tooth #</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Treatment</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Unit Price</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Qty</th>
                <th className="px-3 py-2 text-right font-semibold text-gray-700">Total</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Provider</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Completed</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-700">
                    {item.toothNumbers.join(', ')}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{item.treatmentName}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-600">
                    {formatCurrency(item.unitPrice, currency)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-gray-600">{item.quantity}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-medium text-gray-800">
                    {formatCurrency(item.unitPrice * item.quantity, currency)}
                  </td>
                  <td className="px-3 py-2 text-gray-600">{item.providerName}</td>
                  <td className="px-3 py-2 text-gray-500 text-xs">{item.dateCompleted ?? '—'}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => { setEditItem(item); setModalOpen(true); }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id!)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pricing summary */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Treatment Cost</span>
          <span className="font-semibold text-gray-900">{formatCurrency(total, currency)}</span>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-500 uppercase tracking-wide">Discount</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={discountType}
              onChange={e => onDiscountTypeChange(e.target.value as TreatmentPlanFormData['discountType'])}
            >
              <option value="none">No Discount</option>
              <option value="fixed_amount">Fixed Amount</option>
              <option value="percentage">Percentage (%)</option>
            </Select>
            {discountType !== 'none' && (
              <>
                <Input
                  type="text"
                  value={discountLabel}
                  onChange={e => onDiscountLabelChange(e.target.value)}
                  placeholder="Label (e.g. Unipal Disc)"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountValue}
                  onChange={e => onDiscountValueChange(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === 'percentage' ? '%' : currency}
                />
              </>
            )}
          </div>
        </div>

        {hasDiscount && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold text-gray-800">
              Total After {discountLabel}
            </span>
            <span className="text-lg font-bold text-blue-700">
              {formatCurrency(discounted, currency)}
            </span>
          </div>
        )}
      </div>

      <AddTreatmentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(null); }}
        onAdd={(item) => {
          if (editItem) {
            onUpdate(editItem.id!, item);
          } else {
            onAdd(item);
          }
        }}
        preselectedTeeth={selectedTeeth}
        defaultProvider={defaultProvider}
        editItem={editItem}
      />
    </div>
  );
}
