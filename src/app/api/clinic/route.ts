import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('clinics').select('*').limit(1).single();
  if (error) return NextResponse.json(null, { status: 200 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Upsert single clinic row
  const { data: existing } = await supabase.from('clinics').select('id').limit(1).single();

  if (existing) {
    const { data, error } = await supabase
      .from('clinics')
      .update({
        name: body.name,
        address: body.address,
        tel: body.tel,
        fax: body.fax,
        currency: body.currency,
        discount_label: body.discountLabel,
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from('clinics')
      .insert({
        name: body.name,
        address: body.address,
        tel: body.tel,
        fax: body.fax,
        currency: body.currency,
        discount_label: body.discountLabel,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  }
}
