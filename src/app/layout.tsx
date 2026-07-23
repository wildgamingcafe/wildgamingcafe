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
  title: "Wild Gaming Cafe | Events Hub",
  description: "Hyderabad's Premier LAN Tournament Hub",
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
