"use client";

import { useState, useEffect, ReactNode } from "react";
import { X, Phone, Gamepad2 } from "lucide-react";

interface BookingButtonProps {
  className?: string;
  children: ReactNode;
}

export default function BookingButton({ className, children }: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle Scroll Locking and Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div 
            className="relative bg-[#111111] border border-[#262626] p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 text-center pt-2">
              <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-2">
                <Gamepad2 className="w-8 h-8 text-accent" />
              </div>
              
              <h2 className="heading-style text-3xl uppercase text-white leading-none tracking-tight">
                Reserve Your<br />
                <span className="text-accent">Gaming Session</span>
              </h2>
              
              <div className="relative p-5 border border-[#262626] bg-[#0A0A0A] text-left">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent -translate-x-[1px] -translate-y-[1px]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent translate-x-[1px] translate-y-[1px]"></div>
                
                <p className="text-text-secondary text-sm font-semibold leading-relaxed">
                  <span className="text-white block mb-1">Online reservations will be available soon.</span>
                  To check availability or reserve a PC or PS5 today, please contact us directly.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <a 
                href="tel:+919381923198"
                className="brand-button-secondary w-full py-3"
              >
                <Phone className="w-4 h-4 mr-2" />
                CALL NOW
              </a>
              <button 
                onClick={() => setIsOpen(false)}
                className="brand-button-outline w-full py-3"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
