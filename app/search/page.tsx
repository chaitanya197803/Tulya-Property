"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, ArrowLeft } from "lucide-react";
import SearchBar from "../../components/search/SearchBar";
import PropertyGrid from "../../components/property/PropertyGrid";
import SortDropdown from "../../components/search/SortDropdown";
import { getAllProperties } from "../../lib/storage";
import { Property, SortOption } from "../../lib/types";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("location") || "";
  const category = searchParams.get("category") || "all";
  const purpose = searchParams.get("purpose") || "all";

  const [properties, setProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");

  useEffect(() => {
    setProperties(getAllProperties());
  }, []);

  const results = properties.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (purpose !== "all" && p.purpose !== purpose) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchLocality = p.locality.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchAddress = p.address.toLowerCase().includes(q);
      const matchId = p.propertyId.toLowerCase().includes(q);
      if (!matchTitle && !matchLocality && !matchCity && !matchAddress && !matchId) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search Bar */}
      <SearchBar
        initialValues={{
          location: query,
          category: category !== "all" ? category : undefined,
          purpose: purpose === "rent" ? "rent" : "buy",
        }}
      />

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C]">
            {query ? `Search Results for "${query}"` : "All Search Results"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Found <strong>{results.length}</strong> matching verified properties
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/map"
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Map View</span>
          </Link>
          <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />
        </div>
      </div>

      {/* Grid */}
      <PropertyGrid
        properties={results}
        emptyMessage={`No properties found matching "${query}". Try searching for Raipur, Shankar Nagar, or Naya Raipur.`}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold text-slate-500">Searching marketplace...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
