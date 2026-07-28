"use client";

import { useState, useEffect, useRef } from "react";

export default function IntroVideo() {
  const [showIntro, setShowIntro] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Skip intro entirely on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    // Skip if already seen in this specific tab session
    const hasSeenThisSession = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenThisSession) {
      return;
    }

    // Limit to 3 lifetime views per user
    const viewsStr = localStorage.getItem("introViews") || "0";
    const lifetimeViews = parseInt(viewsStr, 10);

    if (lifetimeViews < 3) {
      setShowIntro(true);
      // Fallback timeout in case video fails to load/play
      const timer = setTimeout(() => {
        handleVideoEnd();
      }, 10000); // Max 10 seconds wait
      return () => clearTimeout(timer);
    }
  }, []);

  const handleVideoEnd = () => {
    if (fadingOut) return;
    setFadingOut(true);
    setTimeout(() => {
      setShowIntro(false);
      
      // Mark as seen this session so it doesn't replay on refresh
      sessionStorage.setItem("hasSeenIntro", "true");
      
      // Increment lifetime views
      const viewsStr = localStorage.getItem("introViews") || "0";
      const lifetimeViews = parseInt(viewsStr, 10);
      localStorage.setItem("introViews", (lifetimeViews + 1).toString());
    }, 1000); // 1s fade out duration
  };

  if (!showIntro) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-1000 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/videos/intro video.webm" type="video/webm" />
        {/* Fallback if needed */}
      </video>
      
      {/* Skip button for convenience */}
      <button 
        onClick={handleVideoEnd}
        className="absolute bottom-8 right-8 text-white/50 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors z-50 bg-black/50 px-4 py-2 rounded"
      >
        Skip Intro
      </button>
    </div>
  );
}
