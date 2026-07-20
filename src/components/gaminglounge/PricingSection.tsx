"use client";

import { motion } from "framer-motion";
import { pcPricing, ps5Pricing } from "@/data/loungeData";
import { Monitor, Gamepad2 } from "lucide-react";
import BookingButton from "@/components/ui/BookingButton";

export default function PricingSection({ data }: { data?: any }) {
  const dynamicPcPricing = pcPricing.map(tier => {
    if (tier.duration === "1 Hour") return { ...tier, price: `₹${data?.pc_1h || "120"}` };
    if (tier.duration === "2 Hours") return { ...tier, price: `₹${data?.pc_2h || "220"}` };
    if (tier.duration === "5 Hours") return { ...tier, price: `₹${data?.pc_5h || "500"}` };
    if (tier.duration === "8 Hours") return { ...tier, price: `₹${data?.pc_8h || "720"}` };
    return tier;
  });

  const dynamicPs5Pricing = ps5Pricing.map(tier => {
    if (tier.players === "1 Player") return { ...tier, price: `₹${data?.ps5_1 || "180"}` };
    if (tier.players === "1-2 Players") return { ...tier, price: `₹${data?.ps5_2 || "250"}` };
    if (tier.players === "2-4 Players") return { ...tier, price: `₹${data?.ps5_4 || "400"}` };
    return tier;
  });

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <h2 className="heading-style text-3xl md:text-4xl text-center uppercase mb-16">
          <span className="text-accent">Pricing</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* PC Gaming Card */}
          <motion.div
            className="border border-[#262626] bg-[#0A0A0A] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 px-8 py-5 border-b border-[#262626] bg-[#111111]">
              <Monitor className="w-5 h-5 text-accent" />
              <h3 className="heading-style text-lg uppercase">PC Gaming</h3>
            </div>
            <div className="p-8">
              <div className="space-y-0">
                {dynamicPcPricing.map((tier) => (
                  <div
                    key={tier.duration}
                    className={`flex items-center justify-between py-4 border-b border-[#1a1a1a] last:border-0 ${
                      tier.popular ? "relative" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-text-primary">{tier.duration}</span>
                      {tier.popular && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent text-black px-2 py-0.5">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="heading-style text-lg text-accent">{tier.price}</span>
                  </div>
                ))}
              </div>
              <BookingButton className="w-full mt-8 flex items-center justify-center px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide bg-[#F4B000] text-black rounded-none transition duration-200 ease hover:bg-[#E0A300]">
                BOOK NOW
              </BookingButton>
            </div>
          </motion.div>

          {/* PS5 Gaming Card */}
          <motion.div
            className="border border-[#262626] bg-[#0A0A0A] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 px-8 py-5 border-b border-[#262626] bg-[#111111]">
              <Gamepad2 className="w-5 h-5 text-accent" />
              <h3 className="heading-style text-lg uppercase">PS5 Gaming</h3>
            </div>
            <div className="p-8">
              <div className="space-y-0">
                {dynamicPs5Pricing.map((tier) => (
                  <div
                    key={tier.players}
                    className="flex items-center justify-between py-4 border-b border-[#1a1a1a] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-text-primary">{tier.players}</span>
                      <span className="text-[10px] text-text-secondary uppercase tracking-wider">({tier.note})</span>
                      {tier.popular && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-accent text-black px-2 py-0.5">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="heading-style text-lg text-accent">{tier.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-text-secondary text-xs mt-4 mb-4 uppercase tracking-wider">
                New Releases • Latest Games Available
              </p>
              <BookingButton className="w-full flex items-center justify-center px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide bg-[#F4B000] text-black rounded-none transition duration-200 ease hover:bg-[#E0A300]">
                PLAY NOW
              </BookingButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
