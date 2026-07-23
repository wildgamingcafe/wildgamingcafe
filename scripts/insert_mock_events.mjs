import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const now = new Date();
  
  // Future dates
  const future1 = new Date(now.getTime() + 10 * 86400000); // 10 days from now
  const future2 = new Date(now.getTime() + 15 * 86400000);
  
  // Past dates
  const past1 = new Date(now.getTime() - 20 * 86400000);
  
  const mockEvents = [
    {
      name: "[MOCK] Valorant Summer Face-off",
      date: future2.toISOString(),
      prize_pool: "₹25,000",
      game: "Valorant",
      status: "Upcoming",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
      rules: JSON.stringify({
        time: "10:00",
        format: "5v5 Double Elim",
        entry_fee: "₹500/Team",
        is_featured: false,
        enable_pre_register: true,
        registration_start_date: new Date(now.getTime() + 2 * 86400000).toISOString(), // Opens in 2 days
        registration_end_date: future1.toISOString()
      })
    },
    {
      name: "[MOCK] CS2 Weekend Brawl",
      date: future1.toISOString(),
      prize_pool: "₹10,000",
      game: "CS2",
      status: "Registration Open",
      image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071",
      rules: JSON.stringify({
        time: "14:00",
        format: "5v5 Single Elim",
        entry_fee: "₹300/Team",
        is_featured: true,
        enable_pre_register: false,
        registration_start_date: new Date(now.getTime() - 1 * 86400000).toISOString(), // Opened yesterday
        registration_end_date: new Date(now.getTime() + 5 * 86400000).toISOString() // Closes in 5 days
      })
    },
    {
      name: "[MOCK] FC25 Midnight Cup",
      date: past1.toISOString(),
      prize_pool: "₹5,000",
      game: "FC25",
      status: "Completed",
      image_url: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2071",
      rules: JSON.stringify({
        time: "20:00",
        format: "1v1",
        entry_fee: "₹100/Player",
        is_featured: false,
        enable_pre_register: false,
        winners_data: { first: "MessiFan99", second: "RonaldoGOAT" }
      })
    }
  ];

  console.log("Inserting mock events...");
  const { data, error } = await supabase.from('events').insert(mockEvents);
  if (error) {
    console.error("Error inserting mock events:", error);
  } else {
    console.log("Successfully inserted mock events!");
  }
}

run();
