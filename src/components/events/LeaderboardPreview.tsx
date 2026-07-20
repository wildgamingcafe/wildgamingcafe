import { LeaderboardEntry } from "@/data/mockData";
import Link from "next/link";

export default function LeaderboardPreview({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  return (
    <section id="leaderboard" className="py-16 bg-surface-100 border-t border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl uppercase text-text-primary mb-2">
                Top Players
              </h2>
              <p className="text-text-secondary text-lg">Current Season Rankings</p>
            </div>
            <Link
              href="/events/leaderboard"
              className="mt-4 md:mt-0 brand-button-outline px-6 py-2 uppercase text-sm"
            >
              Full Leaderboard
            </Link>
          </div>

          <div className="bg-background border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-200 text-text-secondary text-xs md:text-sm font-semibold uppercase">
              <div className="w-12 md:w-16 text-center">Rank</div>
              <div className="flex-1 px-3 md:px-4">Player</div>
              <div className="w-20 md:w-32 text-right">Game</div>
            </div>
            
            {leaderboard.map((entry, idx) => (
              <div 
                key={entry.name}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-surface-200 transition-colors"
              >
                <div className="w-12 md:w-16 text-center text-lg md:text-xl font-sans font-semibold">
                  <span className={idx < 3 ? "text-accent" : "text-text-secondary"}>#{entry.rank}</span>
                </div>
                <div className="flex-1 px-3 md:px-4 font-semibold text-text-primary text-sm md:text-lg font-sans truncate">
                  {entry.name}
                </div>
                <div className="w-20 md:w-32 text-right text-text-secondary text-[10px] md:text-sm font-semibold uppercase font-sans truncate">
                  {entry.game}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
