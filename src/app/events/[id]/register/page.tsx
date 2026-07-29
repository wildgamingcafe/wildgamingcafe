import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Users, Calendar } from "lucide-react";
import DynamicRegistrationForm from "@/components/events/DynamicRegistrationForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: event } = await supabase.from('events').select('name, game, entry_fee, image_url, thumbnail_image_url').eq('id', resolvedParams.id).single();
  
  if (!event) return { title: "Event Not Found" };

  const description = `Join the upcoming ${event.game} tournament at Wild Gaming Cafe. Secure your spot now!`;
  const image = event.thumbnail_image_url || event.image_url || "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543667/DSC09625_wu17dp.jpg";

  return {
    title: `Register: ${event.name}`,
    description,
    openGraph: {
      title: `${event.name} - ${event.game} Tournament`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} - ${event.game} Tournament`,
      description,
      images: [image],
    }
  };
}

export const dynamic = 'force-dynamic';

export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { data: event, error } = await supabase.from('events').select('*').eq('id', resolvedParams.id).single();

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-black uppercase text-white mb-4">Event Not Found</h1>
        <Link href="/events" className="text-accent hover:underline">Return to Events</Link>
      </div>
    );
  }

  // Parse Rules
  let extra: any = {};
  try {
    if (event.rules) extra = JSON.parse(event.rules);
  } catch(e) {}
  const tournament = { ...event, ...extra };

  // Date Check
  const now = new Date();
  const startDate = tournament.registration_start_date ? new Date(tournament.registration_start_date) : null;
  const endDate = tournament.registration_end_date ? new Date(tournament.registration_end_date) : null;
  
  let isPreReg = false;
  if (startDate && now < startDate && tournament.enable_pre_register) {
    isPreReg = true;
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <Link href="/events" className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="uppercase text-sm font-bold tracking-wider">Back to Tournaments</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Event Recap */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#262626]">
              <Image 
                src={tournament.thumbnail_image_url || tournament.image_url || '/images/placeholder.jpg'}
                alt={tournament.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-accent text-black text-xs font-black uppercase px-2 py-1 rounded-sm mb-2 inline-block">
                  {tournament.game}
                </span>
                <h2 className="text-white font-black text-xl uppercase leading-tight shadow-black drop-shadow-md">
                  {tournament.name}
                </h2>
              </div>
            </div>

            <div className="bg-[#111] p-6 rounded-xl border border-[#262626] space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <Calendar className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-xs font-bold uppercase">Date</div>
                  <div className="text-white text-sm">{new Date(tournament.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Users className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-xs font-bold uppercase">Format</div>
                  <div className="text-white text-sm">{tournament.format || 'Standard'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Gamepad2 className="w-5 h-5 text-accent" />
                <div>
                  <div className="text-xs font-bold uppercase">Entry Fee</div>
                  <div className="text-white text-sm font-bold">{tournament.entry_fee || 'Free'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Registration Form */}
          <div className="md:col-span-2">
            <DynamicRegistrationForm event={tournament} isPreReg={isPreReg} />
          </div>

        </div>
      </div>
    </div>
  );
}
