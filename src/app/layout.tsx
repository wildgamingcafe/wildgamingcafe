import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ConditionalTicker from "@/components/layout/ConditionalTicker";
import IntroVideo from "@/components/layout/IntroVideo";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Cache layout for 60 seconds (massive speed boost)

const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Wild Gaming Cafe",
    default: "Wild Gaming Cafe | Hyderabad's Premier LAN Tournament Hub",
  },
  description: "The ultimate destination for gamers in Hyderabad. High-end PCs, competitive LAN tournaments, and an elite esports community.",
  keywords: ["Gaming Cafe Hyderabad", "LAN Tournaments", "Valorant Tournament", "CS2 LAN", "PC Gaming Cafe", "Esports Hyderabad", "Wild Gaming Cafe Kompally", "Gaming Lounge"],
  authors: [{ name: "Wild Gaming Cafe" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wildgamingcafe.com",
    siteName: "Wild Gaming Cafe",
    title: "Wild Gaming Cafe | Hyderabad's Premier LAN Tournament Hub",
    description: "The ultimate destination for gamers in Hyderabad. High-end PCs, competitive LAN tournaments, and an elite esports community.",
    images: [
      {
        url: "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543667/DSC09625_wu17dp.jpg",
        width: 1200,
        height: 630,
        alt: "Wild Gaming Cafe Arena",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wild Gaming Cafe | Esports Hub",
    description: "The ultimate destination for gamers in Hyderabad. Join our LAN tournaments today!",
    images: ["https://res.cloudinary.com/pyxtsol1/image/upload/v1784543667/DSC09625_wu17dp.jpg"],
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await supabase.from('settings').select('cms_data').eq('id', 1).single();
  const cmsData = data?.cms_data || {};
  const tickerActive = cmsData.global?.ticker_active ?? false;
  const tickerText = cmsData.global?.ticker_text ?? "";

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Wild Gaming Cafe",
              "image": "https://res.cloudinary.com/pyxtsol1/image/upload/v1784543667/DSC09625_wu17dp.jpg",
              "@id": "https://wildgamingcafe.com",
              "url": "https://wildgamingcafe.com",
              "telephone": "+919381923198",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "209, 2nd Floor, Vaishnavi Lamani Arcade",
                "addressLocality": "Kompally",
                "addressRegion": "Hyderabad",
                "addressCountry": "IN"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "23:00"
              }
            })
          }}
        />
        <IntroVideo />
        <ConditionalTicker active={tickerActive} text={tickerText} />
        <ConditionalNavbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
