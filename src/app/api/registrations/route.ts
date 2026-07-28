import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function getInitials(str: string) {
  if (!str) return 'XX';
  const words = str.split(' ').filter(w => w.trim().length > 0);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().substring(0, 4);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate
    if (!body.event_id || !body.registration_type || !body.captain_details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch Event Details for Token Generation
    const { data: eventData } = await supabase.from('events').select('name, game').eq('id', body.event_id).single();
    
    // 2. Fetch Registration Count for Sequence Number
    const { count } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('event_id', body.event_id);
    
    // 3. Generate Token (e.g. CAWVAL01)
    const seq = ((count || 0) + 1).toString().padStart(2, '0');
    const eventPrefix = getInitials(eventData?.name || 'EVENT');
    const gamePrefix = getInitials(eventData?.game || 'GAME');
    const generatedToken = `${eventPrefix}${gamePrefix}${seq}`;

    // 4. Inject token into captain details
    const captainDetailsWithToken = {
      ...body.captain_details,
      token: generatedToken
    };

    const payload = {
      event_id: body.event_id,
      registration_type: body.registration_type,
      team_name: body.team_name || null,
      captain_details: captainDetailsWithToken,
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

    // 5. Send Email via EmailJS (if configured)
    const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    let emailSent = false;
    if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey && captainDetailsWithToken.email) {
      try {
        const emailRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: emailJsPublicKey,
            template_params: {
              to_email: captainDetailsWithToken.email,
              user_name: captainDetailsWithToken.name || "Gamer",
              tournament_name: eventData?.name || "Tournament",
              token: generatedToken,
              total_amount: body.total_price
            }
          })
        });
        if (emailRes.ok) emailSent = true;
      } catch (err) {
        console.error("Failed to send EmailJS:", err);
      }
    }

    return NextResponse.json({ success: true, data, token: generatedToken, emailSent }, { status: 201 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
