"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Trophy, Swords, Gamepad2, Monitor, Crosshair, Star } from "lucide-react";

const iconMap: Record<string, any> = {
  Calendar, Users, Trophy, Swords, Gamepad2, Monitor, Crosshair, Star
};

const defaultCards = [
  { icon: "Calendar", title: "Weekly Gaming Events", description: "Regular community gaming sessions every week." },
  { icon: "Trophy", title: "LAN Tournaments", description: "Compete in high-stakes LAN tournaments for cash prizes." },
  { icon: "Users", title: "Community Nights", description: "Meet, play and connect with Hyderabad's gaming community." },
  { icon: "Swords", title: "Valorant Events", description: "Weekly Valorant scrims, tournaments and ranked nights." },
  { icon: "Gamepad2", title: "FC25 Competitions", description: "FIFA tournaments and casual matches with friends." },
];

export default function TournamentsCommunity({ data }: { data?: any }) {
  const title = data?.title || "Tournaments & Community";
  const titleWords = title.split(" ");
  const lastWord = titleWords.pop();
  const titleStart = titleWords.join(" ");

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="heading-style text-3xl md:text-4xl uppercase mb-4">
              {titleStart} <span className="text-accent">{lastWord}</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              {data?.description || "More than just a gaming cafe — we're a competitive community."}
            </p>
          </div>
          <Link
            href="/events"
            className="mt-6 md:mt-0 inline-flex items-center gap-2 px-8 py-3 font-sans text-sm font-semibold uppercase tracking-wide bg-transparent border border-white text-white rounded-none transition duration-200 ease hover:bg-white hover:text-black"
          >
            VIEW EVENTS HUB
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(data?.cards || defaultCards).map((card: any, i: number) => {
            const IconComponent = iconMap[card.icon] || Star;
            return (
              <motion.div
                key={card.title}
                className="border border-[#262626] bg-[#0A0A0A] p-6 hover:border-accent/40 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <IconComponent className="w-7 h-7 text-accent mb-4" />
                <h3 className="heading-style text-sm uppercase mb-2">{card.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
