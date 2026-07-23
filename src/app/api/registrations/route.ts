import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate
    if (!body.event_id || !body.registration_type || !body.captain_details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = {
      event_id: body.event_id,
      registration_type: body.registration_type,
      team_name: body.team_name || null,
      captain_details: body.captain_details,
      teammates_details: body.teammates_details || [],
      total_price: body.total_price,
      payment_status: 'Unpaid'
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert([payload])
      .select();

    if (error) {
      console.error('Supabase error inserting registration:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
