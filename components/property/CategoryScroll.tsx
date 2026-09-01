"use client";

import Link from "next/link";
import {
  Home,
  MapPin,
  Trees,
  Building2,
  Castle,
  Building,
  Construction,
  Briefcase,
} from "lucide-react";
import { propertyCategories } from "../../data/categories";

const iconMap: Record<string, React.ElementType> = {
  Home: Home,
  MapPin: MapPin,
  Trees: Trees,
  Building2: Building2,
  Castle: Castle,
  Building: Building,
  Construction: Construction,
  Briefcase: Briefcase,
};

interface CategoryScrollProps {
  activeCategory?: string;
}

export default function CategoryScroll({ activeCategory }: CategoryScrollProps) {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-2 px-1">
        {/* "All" button */}
        <Link
          href="/properties"
          className={`shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
            !activeCategory || activeCategory === "all"
              ? "bg-[#0B192C] text-white border-[#0B192C] shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:border-[#C5A059] hover:bg-slate-50"
          }`}
        >
          <span>✨ All Properties</span>
        </Link>

        {propertyCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || Home;
          const isActive = activeCategory === cat.slug || activeCategory === cat.id;

          return (
            <Link
              key={cat.id}
              href={`/properties/${cat.slug}`}
              className={`shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all group ${
                isActive
                  ? "bg-[#0B192C] text-white border-[#0B192C] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#C5A059] hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? "text-[#C5A059]" : "text-slate-500 group-hover:text-[#C5A059]"
                }`}
              />
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-slate-800 text-[#C5A059]"
                    : "bg-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-800"
                }`}
              >
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
