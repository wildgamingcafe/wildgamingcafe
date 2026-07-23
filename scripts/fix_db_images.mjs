import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDB() {
  console.log('Fetching all events...');
  const { data: events, error: fetchErr } = await supabase.from('events').select('*');
  if (fetchErr) return console.error(fetchErr);
  
  for (const event of events) {
    if (event.name.startsWith('[MOCK]')) {
      let img = "";
      if (event.game === 'Valorant') img = "/images/Valorant.jpg";
      else if (event.game === 'CS2') img = "/images/CS2.jpg";
      else if (event.game === 'FC25') img = "/images/FC26.jpg";
      else if (event.game === 'Mobile' && event.name.includes('Call of Duty')) img = "/images/COD.jpg";
      else if (event.game === 'Mobile') img = "/images/PUBG.jpg";
      else if (event.name.includes('Tekken')) img = "/images/Tekkan8.jpg";
      else img = "/images/PC gaming.webp";

      console.log(`Setting thumbnail_image_url for ${event.name} to ${img}`);
      const { error } = await supabase.from('events').update({ thumbnail_image_url: img, banner_image_url: img }).eq('id', event.id);
      if (error) console.error("Error updating:", error);
    }
  }
  
  console.log('DB updates complete!');
}

fixDB();
