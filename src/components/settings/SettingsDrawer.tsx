'use client';
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { usePlanStore } from '@/lib/store';
import {
  TREATMENT_TYPES,
  TREATMENT_CATEGORIES,
} from '@/lib/treatment-types';
import { newId } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = 'clinic' | 'providers' | 'prices' | 'consents';

export default function SettingsDrawer({ open, onOpenChange }: Props) {
  const [tab, setTab] = useState<Tab>('clinic');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 border-b border-gray-200">
          {(
            [
              ['clinic', 'Clinic'],
              ['providers', 'Providers'],
              ['prices', 'Price list'],
              ['consents', 'Consent templates'],
            ] as Array<[Tab, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={
                'px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ' +
                (tab === id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800')
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {tab === 'clinic' && <ClinicSettings />}
          {tab === 'providers' && <ProviderSettings />}
          {tab === 'prices' && <PriceSettings />}
          {tab === 'consents' && <ConsentSettings />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ClinicSettings() {
  const clinic = usePlanStore(s => s.clinic);
  const setClinic = usePlanStore(s => s.setClinic);
  return (
    <div className="space-y-3 pt-2">
      <div>
        <Label>Clinic name</Label>
        <Input
          value={clinic.name}
          onChange={e => setClinic({ name: e.target.value })}
        />
      </div>
      <div>
        <Label>Address (one line per row)</Label>
        <Textarea
          rows={3}
          value={clinic.addressLines.join('\n')}
          onChange={e =>
            setClinic({
              addressLines: e.target.value.split('\n').map(l => l.trim()),
            })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Telephone</Label>
          <Input
            value={clinic.tel}
            onChange={e => setClinic({ tel: e.target.value })}
          />
        </div>
        <div>
          <Label>Fax</Label>
          <Input
            value={clinic.fax}
            onChange={e => setClinic({ fax: e.target.value })}
          />
        </div>
        <div>
          <Label>Currency</Label>
          <Input
            value={clinic.currency}
            onChange={e => setClinic({ currency: e.target.value })}
          />
        </div>
        <div>
          <Label>Validity (months)</Label>
          <Input
            type="number"
            min={1}
            value={clinic.validityMonths}
            onChange={e =>
              setClinic({ validityMonths: parseInt(e.target.value) || 3 })
            }
          />
        </div>
      </div>
    </div>
  );
}

function ProviderSettings() {
  const providers = usePlanStore(s => s.providers);
  const setProviders = usePlanStore(s => s.setProviders);
  return (
    <div className="space-y-2 pt-2">
      {providers.map((p, idx) => (
        <div key={p.id} className="flex gap-2">
          <Input
            value={p.name}
            onChange={e => {
              const next = [...providers];
              next[idx] = { ...p, name: e.target.value };
              setProviders(next);
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setProviders(providers.filter(x => x.id !== p.id))}
            className="hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setProviders([...providers, { id: newId(), name: 'New provider' }])
        }
      >
        <Plus className="h-4 w-4" /> Add provider
      </Button>
    </div>
  );
}

function PriceSettings() {
  const priceList = usePlanStore(s => s.priceList);
  const setPriceOverride = usePlanStore(s => s.setPriceOverride);
  const currency = usePlanStore(s => s.clinic.currency);

  return (
    <div className="space-y-4 pt-2">
      <p className="text-xs text-gray-500">
        Override the default price per treatment. Leave blank to use the default.
        Currency: {currency}
      </p>
      {TREATMENT_CATEGORIES.map(cat => {
        const items = TREATMENT_TYPES.filter(t => t.category === cat);
        return (
          <div key={cat}>
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              {cat}
            </h4>
            <div className="space-y-1">
              {items.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex-1 truncate">{t.name}</span>
                  <span className="text-xs text-gray-400 tabular-nums w-20 text-right">
                    default {t.defaultPrice}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="—"
                    value={priceList[t.id] ?? ''}
                    onChange={e => {
                      const v = e.target.value;
                      setPriceOverride(t.id, v === '' ? null : parseFloat(v));
                    }}
                    className="w-24"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConsentSettings() {
  const templates = usePlanStore(s => s.consentTemplates);
  const setConsentTemplate = usePlanStore(s => s.setConsentTemplate);
  return (
    <div className="space-y-4 pt-2">
      {templates.map(t => (
        <div key={t.id}>
          <Label>
            {t.label}{' '}
            <span className="text-xs text-gray-400 font-normal">
              · category: {t.category}
            </span>
          </Label>
          <Textarea
            rows={4}
            value={t.body}
            onChange={e => setConsentTemplate(t.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
