'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Provider } from '@/lib/types';

interface ClinicForm {
  name: string;
  address: string;
  tel: string;
  fax: string;
  currency: string;
  discountLabel: string;
}

const DEFAULT_CLINIC: ClinicForm = {
  name: '',
  address: '',
  tel: '',
  fax: '',
  currency: 'BD',
  discountLabel: 'Unipal Disc',
};

export default function SettingsPage() {
  const [clinic, setClinic] = useState<ClinicForm>(DEFAULT_CLINIC);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [newProvider, setNewProvider] = useState({ name: '', title: 'Dr.' });
  const [clinicSaved, setClinicSaved] = useState(false);
  const [clinicSaving, setClinicSaving] = useState(false);
  const [clinicError, setClinicError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/clinic').then(r => r.json()).catch(() => null),
      fetch('/api/providers').then(r => r.json()).catch(() => []),
    ]).then(([c, p]) => {
      if (c) {
        setClinic({
          name: c.name ?? '',
          address: c.address ?? '',
          tel: c.tel ?? '',
          fax: c.fax ?? '',
          currency: c.currency ?? 'BD',
          discountLabel: c.discount_label ?? 'Unipal Disc',
        });
      }
      setProviders(p ?? []);
      setLoading(false);
    });
  }, []);

  const saveClinic = async () => {
    setClinicSaving(true);
    setClinicError('');
    try {
      const res = await fetch('/api/clinic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinic),
      });
      if (!res.ok) throw new Error(await res.text());
      setClinicSaved(true);
      setTimeout(() => setClinicSaved(false), 3000);
    } catch {
      setClinicError('Failed to save clinic settings.');
    } finally {
      setClinicSaving(false);
    }
  };

  const addProvider = async () => {
    if (!newProvider.name.trim()) return;
    const res = await fetch('/api/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProvider),
    });
    if (res.ok) {
      const p = await res.json();
      setProviders(prev => [...prev, p]);
      setNewProvider({ name: '', title: 'Dr.' });
    }
  };

  const removeProvider = async (id: string) => {
    if (!confirm('Remove this provider?')) return;
    await fetch('/api/providers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Clinic Info */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-800">Clinic Information</h2>
        <p className="text-sm text-gray-500 -mt-3">This information appears in the header of every generated PDF.</p>

        <div className="space-y-1">
          <Label>Clinic / Practice Name</Label>
          <Input
            value={clinic.name}
            onChange={e => setClinic(c => ({ ...c, name: e.target.value }))}
            placeholder="e.g. Dr. Shahla Dental Centre"
          />
        </div>
        <div className="space-y-1">
          <Label>Address</Label>
          <Input
            value={clinic.address}
            onChange={e => setClinic(c => ({ ...c, address: e.target.value }))}
            placeholder="e.g. Seef District, Nordic Tower, Office 84 Building 79 Road 2802, Seef 428"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Phone / Tel</Label>
            <Input
              value={clinic.tel}
              onChange={e => setClinic(c => ({ ...c, tel: e.target.value }))}
              placeholder="77111140"
            />
          </div>
          <div className="space-y-1">
            <Label>Fax (optional)</Label>
            <Input
              value={clinic.fax}
              onChange={e => setClinic(c => ({ ...c, fax: e.target.value }))}
              placeholder=""
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Currency Symbol</Label>
            <Input
              value={clinic.currency}
              onChange={e => setClinic(c => ({ ...c, currency: e.target.value }))}
              placeholder="BD"
              maxLength={5}
            />
          </div>
          <div className="space-y-1">
            <Label>Default Discount Label</Label>
            <Input
              value={clinic.discountLabel}
              onChange={e => setClinic(c => ({ ...c, discountLabel: e.target.value }))}
              placeholder="e.g. Unipal Disc"
            />
          </div>
        </div>

        {clinicError && <p className="text-sm text-red-600">{clinicError}</p>}

        <Button onClick={saveClinic} disabled={clinicSaving}>
          {clinicSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : clinicSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {clinicSaved ? 'Saved!' : 'Save Clinic Info'}
        </Button>
      </section>

      {/* Providers */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Providers / Dentists</h2>
          <p className="text-sm text-gray-500 mt-0.5">These appear in the provider dropdown when creating a new plan.</p>
        </div>

        {providers.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No providers yet.</p>
        ) : (
          <div className="space-y-2">
            {providers.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-sm font-medium text-gray-800">{p.title} {p.name}</span>
                <button
                  onClick={() => removeProvider(p.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end pt-1">
          <div className="space-y-1 w-20">
            <Label className="text-xs">Title</Label>
            <select
              value={newProvider.title}
              onChange={e => setNewProvider(p => ({ ...p, title: e.target.value }))}
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Dr.</option>
              <option>Prof.</option>
              <option>Ass.</option>
            </select>
          </div>
          <div className="space-y-1 flex-1">
            <Label className="text-xs">Provider Name</Label>
            <Input
              value={newProvider.name}
              onChange={e => setNewProvider(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Zainab Al Mosawi"
              onKeyDown={e => e.key === 'Enter' && addProvider()}
            />
          </div>
          <Button onClick={addProvider} variant="outline">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </section>

      {/* Supabase setup hint */}
      <section className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Database Setup</p>
        <p>
          This app uses Supabase. Create a project at{' '}
          <span className="font-mono bg-blue-100 px-1 rounded">supabase.com</span>, run the SQL schema
          below, then add{' '}
          <span className="font-mono bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</span> and{' '}
          <span className="font-mono bg-blue-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>{' '}
          to your <span className="font-mono bg-blue-100 px-1 rounded">.env.local</span> file.
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer font-medium hover:underline">Show SQL schema</summary>
          <pre className="mt-2 overflow-x-auto rounded bg-blue-100 p-3 text-xs text-blue-900 whitespace-pre-wrap">
{`create table clinics (
  id uuid primary key default gen_random_uuid(),
  name text, address text, tel text, fax text,
  currency text default 'BD',
  discount_label text default 'Discount',
  created_at timestamptz default now()
);

create table providers (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  name text not null, title text default 'Dr.',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table treatment_plans (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id),
  patient_name text not null,
  patient_title text default 'Mr.',
  ref_no text,
  provider_id uuid references providers(id),
  provider_name text,
  plan_date date,
  discount_type text default 'none',
  discount_value numeric default 0,
  discount_label text,
  consent_text text,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table treatment_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references treatment_plans(id) on delete cascade,
  tooth_numbers text[],
  treatment_name text,
  unit_price numeric default 0,
  quantity int default 1,
  provider_name text,
  date_completed date,
  sort_order int default 0
);`}
          </pre>
        </details>
      </section>
    </div>
  );
}
