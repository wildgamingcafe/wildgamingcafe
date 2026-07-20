import Link from "next/link";
import Image from "next/image";
import ParticleBackground from "@/components/layout/ParticleBackground";

export default function Footer() {
  return (
    <footer id="footer" className="relative bg-[#050505] border-t border-[#262626] pt-16 pb-8 font-sans overflow-hidden">
      <ParticleBackground id="particles-footer" />
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">
          
          {/* Logo Block */}
          <div className="lg:col-span-1 flex items-center justify-center lg:justify-start">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="Wild Gaming Cafe" width={400} height={400} className="w-32 lg:w-48 h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform" />
            </Link>
          </div>

          {/* Contact & Hours Block */}
          <div className="lg:col-span-1 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-white font-bold text-sm mb-2">Phone:</h3>
              <p className="text-white font-bold text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +91-9381923198
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-2">Hours:</h3>
              <p className="text-white font-bold text-sm">Mon-Sun: 9 AM - 11 PM</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-style text-lg mb-6 uppercase text-text-primary">Quick Links</h3>
            <ul className="space-y-3 font-semibold">
              {[
                { name: "Home", href: "/" },
                { name: "Pricing", href: "/#pricing" },
                { name: "Game Library", href: "/gamelibrary" },
                { name: "Events", href: "/events" },
                { name: "Promotions", href: "/promotions" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-text-secondary hover:text-text-primary transition-colors text-sm animated-underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="heading-style text-lg mb-6 uppercase text-text-primary">Connect</h3>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/wildgamingcafe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#262626] flex items-center justify-center text-text-secondary hover:bg-accent hover:text-black hover:border-accent transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="0" ry="0" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a 
                href="https://discord.gg/S3TGtRtu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#262626] flex items-center justify-center text-text-secondary hover:bg-accent hover:text-black hover:border-accent transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Location Map */}
          <div className="lg:col-span-2">
            <h3 className="heading-style text-lg mb-6 uppercase text-text-primary">Our Location</h3>
            <div className="w-full h-32 md:h-40 rounded-sm overflow-hidden border border-[#262626] mb-3">
              <iframe 
                src="https://www.google.com/maps?q=Vaishnavi+Lamani+Arcade,+Kompally,+Hyderabad&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-text-secondary text-[11px] font-semibold leading-relaxed">
              209, 2nd Floor, Vaishnavi Lamani Arcade, Above Ratnadeep Supermarket, Dulapally Road, Kompally, Hyderabad
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 pb-12 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4 font-semibold">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Wild Gaming Cafe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
