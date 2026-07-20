"use client";

interface GenreNavProps {
  genres: string[];
}

export default function GenreNav({ genres }: GenreNavProps) {
  const allGenres = ["All", ...genres];

  const scrollToGenre = (genre: string) => {
    if (genre === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const elementId = `genre-${genre.toLowerCase().replace(/\s+/g, '-')}`;
    const element = document.getElementById(elementId);
    
    if (element) {
      // Get the fixed navbar height so we don't hide the heading behind it
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="w-full bg-[#050505] py-12 border-b border-[#1a1a1a]">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-8">
          <h2 className="heading-style text-xl uppercase tracking-widest text-text-primary">
            BROWSE <span className="text-accent">BY GENRE</span>
          </h2>
        </div>

        <div className="flex items-center md:justify-center gap-3 overflow-x-auto no-scrollbar max-w-5xl mx-auto px-4 pb-2">
          {allGenres.map(g => (
            <button
              key={g}
              onClick={() => scrollToGenre(g)}
              className="whitespace-nowrap px-6 py-2.5 rounded-full border border-[#262626] bg-[#0A0A0A] text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-black hover:bg-accent hover:border-accent transition-all"
            >
              {g}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
