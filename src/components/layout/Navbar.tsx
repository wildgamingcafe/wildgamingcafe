"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "HOME", href: "/" },
    { name: "PRICING", href: "/#pricing" },
    { name: "GAME LIBRARY", href: "/gamelibrary" },
    { name: "EVENTS", href: "/events" },
    { name: "PROMOTIONS", href: "/promotions" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/#pricing" && pathname === "/") {
      e.preventDefault();
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300 px-4 sm:px-6 md:px-10 lg:px-14 py-1",
        scrolled ? "bg-[#050505] border-b border-[#262626]" : "bg-transparent border-transparent shadow-none"
      )}
    >
      <div className="flex items-center justify-between w-full h-full">
        
        {/* LEFT SIDE: Logo & Navigation Group */}
        <div className="flex items-center gap-10 lg:gap-14">
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Wild Gaming Cafe" 
              width={240} 
              height={240} 
              className="w-auto h-16 sm:h-16 md:h-20 lg:h-24 object-contain" 
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "text-sm font-semibold uppercase tracking-wide animated-underline",
                  (link.href === "/" ? pathname === "/" : link.href.startsWith("/#") ? pathname === "/" : pathname.startsWith(link.href)) ? "text-text-primary" : "text-text-primary/80"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT SIDE: Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/wildgamingcafe/" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 border border-white/20 rounded-none p-0.5">
                <rect width="20" height="20" x="2" y="2" rx="0" ry="0" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="https://discord.gg/S3TGtRtu" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 border border-white/20 rounded-none p-0.5">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
          </div>
          <button
            onClick={() => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center h-[28px] px-[40px] font-sans text-[11px] font-[800] uppercase tracking-normal bg-white text-black border-2 border-white rounded-none transition duration-200 ease hover:bg-[#F4B000] hover:border-[#F4B000]"
          >
            Contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-[#050505]">
          <div className="flex flex-col px-4 py-4 space-y-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(e, link.href);
                }}
                className="text-base font-semibold uppercase py-2"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex items-center gap-6 border-t border-border">
              <button
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center h-[28px] w-auto px-[40px] font-sans text-[11px] font-[800] uppercase tracking-normal bg-white text-black border-2 border-white rounded-none transition duration-200 ease hover:bg-[#F4B000] hover:border-[#F4B000] mx-auto mt-4"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
