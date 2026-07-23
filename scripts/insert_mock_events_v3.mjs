import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function injectMocks() {
  console.log('Cleaning up old mock events...');
  // Delete all events starting with [MOCK]
  await supabase.from('events').delete().like('name', '[MOCK]%');

  const now = new Date();
  const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const farFutureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  // 3 ONGOING / LIVE
  const ongoing = [
    {
      name: "[MOCK] Valorant City Finals",
      game: "Valorant",
      description: "The top 8 teams battle it out live at the cafe.",
      date: now.toISOString(),
      prize_pool: "₹1,00,000",
      status: "Live",
      image_url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543667/DSC09625_wu17dp.jpg",
      rules: JSON.stringify({ format: "5v5 Bracket", time: "10:00", entry_fee: "₹1000/Team", team_size_limit: 5, price_per_player: 200, is_featured: false })
    },
    {
      name: "[MOCK] CS2 Weekend Brawl",
      game: "CS2",
      description: "Weekly CS2 madness.",
      date: now.toISOString(),
      prize_pool: "₹50,000",
      status: "Registration Open",
      image_url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543633/DSC09620_de6j9d.jpg",
      rules: JSON.stringify({ format: "5v5 Single Elim", time: "14:00", entry_fee: "₹500/Team", team_size_limit: 5, price_per_player: 100, is_featured: false })
    },
    {
      name: "[MOCK] BGMI Squad Clash",
      game: "Mobile",
      description: "Drop in and survive.",
      date: now.toISOString(),
      prize_pool: "₹25,000",
      status: "Filling Fast",
      image_url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543689/DSC09643_ubmhle.jpg",
      rules: JSON.stringify({ format: "Squads 4v4", time: "16:00", entry_fee: "₹400/Team", team_size_limit: 4, price_per_player: 100, is_featured: false })
    }
  ];

  // 6 UPCOMING
  const upcoming = [
    {
      name: "[MOCK] FC25 Midnight Cup",
      game: "FC25",
      description: "1v1 FIFA tournament.",
      date: futureDate,
      prize_pool: "₹10,000",
      status: "Upcoming",
      image_url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543727/DSC09666_rtkrt7.jpg",
      rules: JSON.stringify({ format: "1v1", time: "23:00", entry_fee: "₹200", team_size_limit: 1, price_per_player: 200, enable_pre_register: true, is_featured: false })
    },
    {
      name: "[MOCK] Tekken 8 Showdown",
      game: "Other",
      description: "King of the Iron Fist tournament.",
      date: futureDate,
      prize_pool: "₹15,000",
      status: "Published",
      image_url: "",
      rules: JSON.stringify({ format: "1v1 Double Elim", time: "18:00", entry_fee: "₹300", team_size_limit: 1, price_per_player: 300, is_featured: false })
    },
    {
      name: "[MOCK] Valorant Rising Stars",
      game: "Valorant",
      description: "For players below Diamond rank.",
      date: farFutureDate,
      prize_pool: "₹20,000",
      status: "Upcoming",
      image_url: "",
      rules: JSON.stringify({ format: "5v5", time: "12:00", entry_fee: "₹500/Team", team_size_limit: 5, price_per_player: 100, is_featured: false })
    },
    {
      name: "[MOCK] CS2 AWP Only",
      game: "CS2",
      description: "Snipers only.",
      date: farFutureDate,
      prize_pool: "₹5,000",
      status: "Upcoming",
      image_url: "",
      rules: JSON.stringify({ format: "2v2", time: "20:00", entry_fee: "₹200/Team", team_size_limit: 2, price_per_player: 100, is_featured: false })
    },
    {
      name: "[MOCK] Apex Legends Trios",
      game: "Other",
      description: "Custom lobby battle royale.",
      date: farFutureDate,
      prize_pool: "₹30,000",
      status: "Published",
      image_url: "",
      rules: JSON.stringify({ format: "Trios", time: "15:00", entry_fee: "₹600/Team", team_size_limit: 3, price_per_player: 200, is_featured: false })
    },
    {
      name: "[MOCK] Call of Duty Mobile",
      game: "Mobile",
      description: "5v5 Search and Destroy.",
      date: farFutureDate,
      prize_pool: "₹15,000",
      status: "Upcoming",
      image_url: "",
      rules: JSON.stringify({ format: "5v5", time: "14:00", entry_fee: "₹500/Team", team_size_limit: 5, price_per_player: 100, is_featured: false })
    }
  ];

  // 4 COMPLETED (Excluding Clash At Wild which is the real one)
  const completed = [
    {
      name: "[MOCK] Summer LAN Party",
      game: "Valorant",
      description: "The biggest event of last summer.",
      date: pastDate,
      prize_pool: "₹2,00,000",
      status: "Completed",
      image_url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543600/blazerapers_yqixlw.jpg",
      rules: JSON.stringify({ format: "5v5", winners_data: { first: "Optic", second: "Loud" }, is_featured: false })
    },
    {
      name: "[MOCK] Free Fire Scrims",
      game: "Mobile",
      description: "Daily scrims finals.",
      date: pastDate,
      prize_pool: "₹10,000",
      status: "Completed",
      image_url: "",
      rules: JSON.stringify({ format: "Squads", winners_data: { first: "Hyd Spartans", second: "Team X" }, is_featured: false })
    },
    {
      name: "[MOCK] FC24 Farewell Cup",
      game: "FC25",
      description: "Last tournament before FC25.",
      date: pastDate,
      prize_pool: "₹15,000",
      status: "Completed",
      image_url: "",
      rules: JSON.stringify({ format: "1v1", winners_data: { first: "MessiFan99", second: "CR7Goat" }, is_featured: false })
    },
    {
      name: "[MOCK] CSGO Legacy Tournament",
      game: "CS2",
      description: "One last ride on Global Offensive.",
      date: pastDate,
      prize_pool: "₹50,000",
      status: "Completed",
      image_url: "",
      rules: JSON.stringify({ format: "5v5", winners_data: { first: "NaVi", second: "FaZe" }, is_featured: false })
    }
  ];

  const allMocks = [...ongoing, ...upcoming, ...completed];
  const { data, error } = await supabase.from('events').insert(allMocks);

  if (error) {
    console.error('Error inserting mocks:', error);
  } else {
    console.log(`Successfully inserted ${allMocks.length} mock events!`);
  }
}

injectMocks();
