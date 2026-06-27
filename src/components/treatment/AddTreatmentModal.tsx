'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { TREATMENT_CATEGORIES, TREATMENT_TYPES, getTreatmentsByCategory } from '@/lib/treatment-types';
import { generateId } from '@/lib/utils';
import type { TreatmentPlanFormData } from '@/lib/types';

type NewItem = Omit<TreatmentPlanFormData['items'][number], 'sortOrder'>;

interface AddTreatmentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: NewItem) => void;
  preselectedTeeth: number[];
  defaultProvider: string;
  editItem?: TreatmentPlanFormData['items'][number] | null;
}

export default function AddTreatmentModal({
  open, onClose, onAdd, preselectedTeeth, defaultProvider, editItem,
}: AddTreatmentModalProps) {
  const [category, setCategory] = useState(TREATMENT_CATEGORIES[0]);
  const [treatmentName, setTreatmentName] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toothInput, setToothInput] = useState('');
  const [providerName, setProviderName] = useState(defaultProvider);
  const [dateCompleted, setDateCompleted] = useState('');
  const [customName, setCustomName] = useState(false);

  const treatments = getTreatmentsByCategory(category);

  useEffect(() => {
    if (open) {
      if (editItem) {
        setToothInput(editItem.toothNumbers.join(', '));
        setTreatmentName(editItem.treatmentName);
        setUnitPrice(editItem.unitPrice);
        setQuantity(editItem.quantity);
        setProviderName(editItem.providerName);
        setDateCompleted(editItem.dateCompleted ?? '');
        const cat = TREATMENT_TYPES.find(t => t.name === editItem.treatmentName)?.category ?? TREATMENT_CATEGORIES[0];
        setCategory(cat as typeof category);
      } else {
        setToothInput(preselectedTeeth.sort((a, b) => a - b).join(', '));
        setTreatmentName('');
        setUnitPrice(0);
        setQuantity(preselectedTeeth.length || 1);
        setProviderName(defaultProvider);
        setDateCompleted('');
        setCustomName(false);
      }
    }
  }, [open, editItem, preselectedTeeth, defaultProvider]);

  useEffect(() => {
    if (!customName && treatments.length > 0) {
      const first = treatments[0];
      setTreatmentName(first.name);
      setUnitPrice(first.defaultPrice);
    }
  }, [category, customName]);

  const handleTreatmentSelect = (name: string) => {
    setTreatmentName(name);
    const t = TREATMENT_TYPES.find(t => t.name === name);
    if (t) setUnitPrice(t.defaultPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teeth = toothInput
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
    onAdd({
      id: editItem?.id ?? generateId(),
      toothNumbers: teeth,
      treatmentName,
      unitPrice,
      quantity,
      providerName,
      dateCompleted: dateCompleted || undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editItem ? 'Edit Treatment' : 'Add Treatment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={category} onChange={e => { setCategory(e.target.value as typeof category); setCustomName(false); }}>
                {TREATMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Treatment</Label>
              <Select value={treatmentName} onChange={e => handleTreatmentSelect(e.target.value)}>
                {treatments.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                <option value="__custom">Custom…</option>
              </Select>
            </div>
          </div>

          {(treatmentName === '__custom' || customName) && (
            <div className="space-y-1">
              <Label>Custom Treatment Name</Label>
              <Input
                value={customName ? treatmentName : ''}
                onChange={e => { setCustomName(true); setTreatmentName(e.target.value); }}
                placeholder="Enter treatment name"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label>Tooth Numbers</Label>
            <Input
              value={toothInput}
              onChange={e => setToothInput(e.target.value)}
              placeholder="e.g. 24, 25, 26"
            />
            <p className="text-xs text-gray-400">Comma-separated FDI tooth numbers</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Unit Price</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Provider Name</Label>
              <Input
                value={providerName}
                onChange={e => setProviderName(e.target.value)}
                placeholder="Dr. Name"
              />
            </div>
            <div className="space-y-1">
              <Label>Date Completed</Label>
              <Input
                type="date"
                value={dateCompleted}
                onChange={e => setDateCompleted(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editItem ? 'Save Changes' : 'Add Treatment'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
