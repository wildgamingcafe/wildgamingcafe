import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log("Checking database connection...");
  const { data, error } = await supabase.from('games').select('*').limit(1);
  if (error) {
    console.error("Error connecting or table missing:", error.message);
  } else {
    console.log("Success! Table exists. Data:", data);
  }
}

checkDatabase();
