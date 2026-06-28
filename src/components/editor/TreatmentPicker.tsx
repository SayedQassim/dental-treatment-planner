'use client';
import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TREATMENT_TYPES, TREATMENT_CATEGORIES } from '@/lib/treatment-types';
import { usePlanStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TreatmentPicker({ open, onOpenChange }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(TREATMENT_CATEGORIES[0]);
  const addLineItem = usePlanStore(s => s.addLineItem);
  const getUnitPrice = usePlanStore(s => s.getUnitPrice);
  const currency = usePlanStore(s => s.clinic.currency);
  const selectedCount = usePlanStore(s => s.plan.selectedTeeth.length);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      return TREATMENT_TYPES.filter(t => {
        const hay = `${t.name} ${t.category}`.toLowerCase();
        return tokens.every(tok => hay.includes(tok));
      });
    }
    return TREATMENT_TYPES.filter(t => t.category === activeCategory);
  }, [search, activeCategory]);

  const handlePick = (id: string) => {
    addLineItem(id);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add treatment</DialogTitle>
          <p className="text-xs text-gray-500">
            {selectedCount > 0
              ? `Will be linked to ${selectedCount} selected tooth/teeth · quantity ${selectedCount}`
              : 'No teeth selected · adds a single line with quantity 1'}
          </p>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search treatments…"
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        {!search && (
          <div className="flex flex-wrap gap-1">
            {TREATMENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={
                  'rounded-full px-2.5 py-1 text-xs border transition-colors ' +
                  (activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 rounded-md border border-gray-200">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No match</div>
          ) : (
            filtered.map(t => {
              const price = getUnitPrice(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handlePick(t.id)}
                  className="w-full text-left p-3 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.category}</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-gray-700">
                    {formatCurrency(price, currency)}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
