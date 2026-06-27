import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') ?? '';

  let query = supabase
    .from('treatment_plans')
    .select(`*, treatment_items(*)`)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('patient_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items, ...planData } = body;

  const { data: plan, error: planError } = await supabase
    .from('treatment_plans')
    .insert({
      clinic_id: planData.clinicId,
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
      status: planData.status ?? 'draft',
    })
    .select()
    .single();

  if (planError) return NextResponse.json({ error: planError.message }, { status: 500 });

  if (items && items.length > 0) {
    const { error: itemsError } = await supabase
      .from('treatment_items')
      .insert(items.map((item: Record<string, unknown>, idx: number) => ({
        plan_id: plan.id,
        tooth_numbers: item.toothNumbers,
        treatment_name: item.treatmentName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        provider_name: item.providerName,
        date_completed: item.dateCompleted ?? null,
        sort_order: idx,
      })));
    if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ id: plan.id }, { status: 201 });
}
