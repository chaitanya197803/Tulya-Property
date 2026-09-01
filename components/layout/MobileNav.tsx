"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPin, Heart, PlusCircle } from "lucide-react";
import { getSavedPropertyIds } from "../../lib/storage";

export default function MobileNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    setSavedCount(getSavedPropertyIds().length);
    const handleSaved = () => setSavedCount(getSavedPropertyIds().length);
    window.addEventListener("tulya:saved-changed", handleSaved);
    return () => window.removeEventListener("tulya:saved-changed", handleSaved);
  }, []);

  // Hide mobile bottom nav on admin route to not clash with admin navigation
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/properties", icon: Search },
    { label: "Map", href: "/map", icon: MapPin },
    { label: "Saved", href: "/saved", icon: Heart, badge: savedCount },
    { label: "Post", href: "/post-property", icon: PlusCircle, highlight: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.highlight) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#0B192C] text-[#C5A059] flex items-center justify-center shadow-lg border-2 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-[#0B192C] mt-1">Post</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-colors ${
                isActive ? "text-[#0B192C] font-bold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-[#0B192C]" : "text-slate-500"}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
