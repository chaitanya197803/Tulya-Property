import { Property } from "../../lib/types";
import PropertyCard from "./PropertyCard";
import { Building2, SearchX } from "lucide-react";
import Link from "next/link";

interface PropertyGridProps {
  properties: Property[];
  viewMode?: "grid" | "list";
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export default function PropertyGrid({
  properties,
  viewMode = "grid",
  emptyMessage = "No properties found matching your criteria.",
  onResetFilters,
}: PropertyGridProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center my-6 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No Matching Properties</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          {emptyMessage}
        </p>
        <div className="flex items-center justify-center space-x-3">
          {onResetFilters ? (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <Link
              href="/properties"
              className="px-5 py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Browse All Properties
            </Link>
          )}
          <Link
            href="/post-property"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Post Your Property
          </Link>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
