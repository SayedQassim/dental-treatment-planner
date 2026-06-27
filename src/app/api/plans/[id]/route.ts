import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase
    .from('treatment_plans')
    .select(`*, treatment_items(*)`)
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { items, ...planData } = body;

  const { error: planError } = await supabase
    .from('treatment_plans')
    .update({
      patient_name: planData.patientName,
      patient_title: planData.patientTitle,
      ref_no: planData.refNo,
      provider_id: planData.providerId,
      provider_name: planData.providerName,
      plan_date: planData.planDate,
      discount_type: planData.discountType,
      discount_value: planData.discountValue,
      discount_label: planData.discountLabel,
      consent_text: planData.consentText,
      status: planData.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (planError) return NextResponse.json({ error: planError.message }, { status: 500 });

  await supabase.from('treatment_items').delete().eq('plan_id', id);
  if (items && items.length > 0) {
    const { error: itemsError } = await supabase.from('treatment_items').insert(
      items.map((item: Record<string, unknown>, idx: number) => ({
        plan_id: id,
        tooth_numbers: item.toothNumbers,
        treatment_name: item.treatmentName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        provider_name: item.providerName,
        date_completed: item.dateCompleted ?? null,
        sort_order: idx,
      }))
    );
    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await supabase.from('treatment_items').delete().eq('plan_id', id);
  const { error } = await supabase.from('treatment_plans').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
