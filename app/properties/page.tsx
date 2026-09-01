"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  MapPin,
  X,
  Search,
  RotateCcw,
} from "lucide-react";
import PropertyFilters from "../../components/property/PropertyFilters";
import PropertyGrid from "../../components/property/PropertyGrid";
import SortDropdown from "../../components/search/SortDropdown";
import { getAllProperties } from "../../lib/storage";
import { Property, FilterState, SortOption, PropertyCategory } from "../../lib/types";

function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");

  // Read URL query parameters into initial filter state
  const initialCategory = searchParams.get("category") as PropertyCategory | null;
  const initialPurpose = searchParams.get("purpose") as any;
  const initialLocation = searchParams.get("location") || searchParams.get("city") || "";
  const initialBudget = searchParams.get("budget") || "";
  const initialFeatured = searchParams.get("featured") === "true";

  let initialMinPrice: number | undefined;
  let initialMaxPrice: number | undefined;
  if (initialBudget) {
    const parts = initialBudget.split("-").map(Number);
    if (parts.length === 2) {
      initialMinPrice = parts[0];
      initialMaxPrice = parts[1];
    }
  }

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || "all",
    purpose: initialPurpose || "all",
    city: initialLocation || undefined,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    featuredOnly: initialFeatured,
  });

  useEffect(() => {
    setProperties(getAllProperties());

    const handleUpdate = () => setProperties(getAllProperties());
    window.addEventListener("tulya:property-added", handleUpdate);
    window.addEventListener("tulya:property-updated", handleUpdate);
    return () => {
      window.removeEventListener("tulya:property-added", handleUpdate);
      window.removeEventListener("tulya:property-updated", handleUpdate);
    };
  }, []);

  // Update filters if URL parameters change
  useEffect(() => {
    const cat = searchParams.get("category") as PropertyCategory | null;
    const pur = searchParams.get("purpose") as any;
    const loc = searchParams.get("location") || searchParams.get("city") || "";
    const bud = searchParams.get("budget") || "";
    const feat = searchParams.get("featured") === "true";

    let minP: number | undefined;
    let maxP: number | undefined;
    if (bud) {
      const parts = bud.split("-").map(Number);
      if (parts.length === 2) {
        minP = parts[0];
        maxP = parts[1];
      }
    }

    setFilters((prev) => ({
      ...prev,
      category: cat || prev.category || "all",
      purpose: pur || prev.purpose || "all",
      city: loc || prev.city || undefined,
      minPrice: minP ?? prev.minPrice,
      maxPrice: maxP ?? prev.maxPrice,
      featuredOnly: feat || prev.featuredOnly,
    }));
  }, [searchParams]);

  // Faceted Filtering
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Category filter
      if (filters.category && filters.category !== "all" && p.category !== filters.category) {
        return false;
      }
      // Purpose filter
      if (filters.purpose && filters.purpose !== "all" && p.purpose !== filters.purpose) {
        return false;
      }
      // City / Locality search filter
      if (filters.city && filters.city !== "all") {
        const query = filters.city.toLowerCase();
        const matchesCity = p.city.toLowerCase().includes(query);
        const matchesLocality = p.locality.toLowerCase().includes(query);
        const matchesAddress = p.address.toLowerCase().includes(query);
        if (!matchesCity && !matchesLocality && !matchesAddress) return false;
      }
      // Search Query filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLoc = p.locality.toLowerCase().includes(q);
        const matchesId = p.propertyId.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesId) return false;
      }
      // Price range
      if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

      // Bedrooms
      if (filters.bedrooms && filters.bedrooms !== "all") {
        if (filters.bedrooms === "4+" && (!p.bedrooms || p.bedrooms < 4)) return false;
        if (typeof filters.bedrooms === "number" && p.bedrooms !== filters.bedrooms) return false;
      }

      // Verified / Featured flags
      if (filters.verifiedOnly && !p.verified) return false;
      if (filters.featuredOnly && !p.featured) return false;

      return true;
    });
  }, [properties, filters]);

  // Sorting
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "area-asc":
        return list.sort((a, b) => a.area - b.area);
      case "area-desc":
        return list.sort((a, b) => b.area - a.area);
      case "newest":
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        // Relevance: Featured first, then verified, then date
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
  }, [filteredProperties, sortOption]);

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      purpose: "all",
      city: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      bedrooms: "all",
      verifiedOnly: false,
      featuredOnly: false,
      searchQuery: "",
    });
    router.push("/properties");
  };

  const removeFilterTag = (key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Property Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified real-estate listings across Raipur, Naya Raipur, Bhilai, and Durg
          </p>
        </div>

        {/* Search Input inline */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery || ""}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by keywords, ID..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0B192C]"
          />
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <PropertyFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
              <PropertyFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                isMobileModal={true}
                onCloseMobileModal={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Listings Main Column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Action Bar (Result count, Filter toggle, Sorting, Grid/List view) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Filters</span>
              </button>

              <span className="text-xs font-bold text-slate-800">
                <strong>{sortedProperties.length}</strong> Properties Available
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <SortDropdown currentSort={sortOption} onSortChange={setSortOption} />

              <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-2xs text-[#0B192C]" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-white shadow-2xs text-[#0B192C]" : "text-slate-400 hover:text-slate-700"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(filters.category !== "all" && filters.category) ||
          (filters.purpose !== "all" && filters.purpose) ||
          filters.city ||
          filters.verifiedOnly ||
          filters.featuredOnly ||
          filters.minPrice !== undefined ? (
            <div className="flex items-center flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-500 font-semibold">Active:</span>

              {filters.category && filters.category !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0B192C] text-white">
                  <span className="capitalize">{filters.category.replace("-", " ")}</span>
                  <button type="button" onClick={() => removeFilterTag("category")}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}

              {filters.purpose && filters.purpose !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900">
                  <span className="capitalize">For {filters.purpose}</span>
                  <button type="button" onClick={() => removeFilterTag("purpose")}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}

              {filters.city && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 text-slate-800">
                  <span>📍 {filters.city}</span>
                  <button type="button" onClick={() => removeFilterTag("city")}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}

              {filters.verifiedOnly && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                  <span>✓ Verified Only</span>
                  <button type="button" onClick={() => removeFilterTag("verifiedOnly")}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}

              {filters.featuredOnly && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#C5A059]/20 text-[#8c6d2c]">
                  <span>⭐ Featured Only</span>
                  <button type="button" onClick={() => removeFilterTag("featuredOnly")}>
                    <X className="w-3 h-3 ml-1" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-2"
              >
                Clear all
              </button>
            </div>
          ) : null}

          {/* Property Cards Grid */}
          <PropertyGrid
            properties={sortedProperties}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold text-slate-500">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
