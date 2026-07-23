import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function injectMocks() {
  // Get CS2 event
  const { data: event } = await supabase.from('events').select('*').eq('game', 'CS2').single();
  if (!event) return console.error('CS2 Event not found');

  let extra = {};
  try { if (event.rules) extra = JSON.parse(event.rules); } catch(e){}
  const price = extra.price_per_player || 300;

  console.log(`Injecting mocks for event: ${event.name}`);

  // Official Teams
  const teams = [
    {
      event_id: event.id,
      registration_type: 'team',
      team_name: 'Optic Gaming',
      captain_details: { name: 'Pujan Mehta', phone: '9876543210', ign: 'FNS' },
      teammates_details: [
        { name: 'Jaccob Whiteaker', ign: 'yay' },
        { name: 'Jimmy Nguyen', ign: 'Marved' },
        { name: 'Austin Roberts', ign: 'crashies' },
        { name: 'Victor Wong', ign: 'Victor' }
      ],
      total_price: `₹${5 * price}`,
      payment_status: 'Unpaid'
    },
    {
      event_id: event.id,
      registration_type: 'team',
      team_name: 'Loud',
      captain_details: { name: 'Matias Deluca', phone: '9876543211', ign: 'Saadhak' },
      teammates_details: [
        { name: 'Erick Santos', ign: 'aspas' },
        { name: 'Bryan Luna', ign: 'pANcada' },
        { name: 'Felipe Basso', ign: 'Less' },
        { name: 'Cauan Silva', ign: 'cauanzin' }
      ],
      total_price: `₹${5 * price}`,
      payment_status: 'Unpaid'
    }
  ];

  // 15 Solos
  const soloNames = [
    'TenZ', 's1mple', 'ZywOo', 'NiKo', 'dev1ce', 'Ropz', 'b1t', 
    'Twistzz', 'KSCERATO', 'Ax1Le', 'sh1ro', 'broky', 'frozen', 
    'm0NESY', 'huNter-'
  ];

  const solos = soloNames.map((ign, i) => ({
    event_id: event.id,
    registration_type: 'solo',
    team_name: null,
    captain_details: { name: `Solo Player ${i}`, phone: `999888770${i}`, ign: ign },
    teammates_details: [],
    total_price: `₹${price}`,
    payment_status: 'Unpaid'
  }));

  const allRegistrations = [...teams, ...solos];

  const { data, error } = await supabase.from('registrations').insert(allRegistrations);

  if (error) {
    console.error('Error inserting mocks:', error);
  } else {
    console.log(`Successfully inserted ${allRegistrations.length} mock registrations!`);
  }
}

injectMocks();
