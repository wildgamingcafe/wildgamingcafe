"use client";

import { usePathname } from "next/navigation";
import NewsTicker from "./NewsTicker";

export default function ConditionalTicker({ active, text }: { active: boolean; text: string }) {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/promotions")) {
    return null;
  }
  
  return <NewsTicker active={active} text={text} />;
}
