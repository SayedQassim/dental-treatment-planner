'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency, calcTotal, calcDiscounted } from '@/lib/utils';

interface Plan {
  id: string;
  patient_name: string;
  patient_title: string;
  ref_no: string;
  provider_name: string;
  plan_date: string;
  status: string;
  discount_type: string;
  discount_value: number;
  discount_label: string;
  treatment_items: Array<{ unit_price: number; quantity: number }>;
}

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPlans = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/plans${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      if (!res.ok) throw new Error(await res.text());
      setPlans(await res.json());
      setError('');
    } catch (e) {
      setError('Could not load plans. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPlans(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this treatment plan? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    setPlans(p => p.filter(x => x.id !== id));
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Plans</h1>
          <p className="text-sm text-gray-500 mt-0.5">All saved plans for your patients</p>
        </div>
        <Button asChild>
          <Link href="/new"><PlusCircle className="h-4 w-4" /> New Plan</Link>
        </Button>
      </div>

      <Input
        placeholder="Search by patient name…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No treatment plans yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first plan to get started</p>
          <Button className="mt-4" asChild>
            <Link href="/new">Create First Plan</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Patient</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Ref #</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Provider</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plans.map(plan => {
                const items = plan.treatment_items ?? [];
                const total = calcTotal(items.map(i => ({ unitPrice: i.unit_price, quantity: i.quantity })));
                const final = calcDiscounted(total, plan.discount_type as 'none' | 'fixed_amount' | 'percentage', plan.discount_value);
                return (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {plan.patient_title} {plan.patient_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{plan.ref_no}</td>
                    <td className="px-4 py-3 text-gray-600">{plan.provider_name}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(plan.plan_date)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-800">
                      {formatCurrency(final)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        plan.status === 'finalised'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {plan.status === 'finalised' ? 'Finalised' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/plan/${plan.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deletePlan(plan.id)}
                          disabled={deleting === plan.id}
                          className="hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
