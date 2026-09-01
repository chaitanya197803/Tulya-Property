"use client";

import { ArrowUpDown } from "lucide-react";
import { SortOption } from "../../lib/types";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-2xs">
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
      <span className="font-semibold text-slate-500 hidden sm:inline">Sort By:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-transparent font-bold text-[#0B192C] focus:outline-none cursor-pointer"
      >
        <option value="relevance">Relevance</option>
        <option value="newest">Newest Listed</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="area-asc">Area: Low to High</option>
        <option value="area-desc">Area: High to Low</option>
      </select>
    </div>
  );
}
