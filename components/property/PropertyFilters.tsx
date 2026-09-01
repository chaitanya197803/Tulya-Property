"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Building,
  MapPin,
  IndianRupee,
  Maximize2,
} from "lucide-react";
import { FilterState, PropertyCategory, PropertyPurpose } from "../../lib/types";
import { chhattisgarhCities } from "../../data/locations";

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

export default function PropertyFilters({
  filters,
  onFilterChange,
  onReset,
  isMobileModal = false,
  onCloseMobileModal,
}: PropertyFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const categories: { id: PropertyCategory | "all"; label: string }[] = [
    { id: "all", label: "All Categories" },
    { id: "plot", label: "Plots & Land" },
    { id: "residential", label: "Residential" },
    { id: "flat", label: "Flats & Apartments" },
    { id: "villa", label: "Villas & Bungalows" },
    { id: "farm-land", label: "Farm Land" },
    { id: "commercial", label: "Commercial" },
    { id: "project", label: "Township Projects" },
    { id: "investment", label: "Pre-Leased Assets" },
  ];

  const bedroomsList = [
    { id: "all", label: "Any" },
    { id: 1, label: "1 BHK" },
    { id: 2, label: "2 BHK" },
    { id: 3, label: "3 BHK" },
    { id: 4, label: "4+ BHK" },
  ];

  const handlePurposeChange = (purpose: PropertyPurpose | "all") => {
    const updated = { ...localFilters, purpose };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handleCategoryChange = (category: PropertyCategory | "all") => {
    const updated = { ...localFilters, category };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handleCityChange = (city: string) => {
    const updated = { ...localFilters, city: city === "all" ? undefined : city };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handleBedroomsChange = (bedrooms: any) => {
    const updated = { ...localFilters, bedrooms };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    const updated = { ...localFilters, minPrice: min, maxPrice: max };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handleToggleVerified = () => {
    const updated = { ...localFilters, verifiedOnly: !localFilters.verifiedOnly };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const handleToggleFeatured = () => {
    const updated = { ...localFilters, featuredOnly: !localFilters.featuredOnly };
    setLocalFilters(updated);
    if (!isMobileModal) onFilterChange(updated);
  };

  const applyModalFilters = () => {
    onFilterChange(localFilters);
    if (onCloseMobileModal) onCloseMobileModal();
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 space-y-6 ${isMobileModal ? "h-full overflow-y-auto" : "shadow-xs"}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-[#0B192C] transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          {isMobileModal && (
            <button
              type="button"
              onClick={onCloseMobileModal}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Purpose: Buy vs Rent */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Listing Purpose
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => handlePurposeChange("all")}
            className={`py-1.5 rounded-lg transition-colors ${
              !localFilters.purpose || localFilters.purpose === "all"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handlePurposeChange("buy")}
            className={`py-1.5 rounded-lg transition-colors ${
              localFilters.purpose === "buy"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => handlePurposeChange("rent")}
            className={`py-1.5 rounded-lg transition-colors ${
              localFilters.purpose === "rent"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rent
          </button>
        </div>
      </div>

      {/* City / Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>City / Location</span>
        </label>
        <select
          value={localFilters.city || "all"}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0B192C] focus:outline-none"
        >
          <option value="all">All Cities in Chhattisgarh</option>
          {chhattisgarhCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Property Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center space-x-1">
          <Building className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Property Type</span>
        </label>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected = (!localFilters.category && cat.id === "all") || localFilters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-[#0B192C] text-white font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
          <IndianRupee className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Budget Range</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handlePriceRangeChange(0, 2500000)}
            className="p-2 rounded-lg border border-slate-200 text-left hover:border-[#C5A059] font-medium text-slate-700"
          >
            Under ₹25L
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeChange(2500000, 5000000)}
            className="p-2 rounded-lg border border-slate-200 text-left hover:border-[#C5A059] font-medium text-slate-700"
          >
            ₹25L - ₹50L
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeChange(5000000, 10000000)}
            className="p-2 rounded-lg border border-slate-200 text-left hover:border-[#C5A059] font-medium text-slate-700"
          >
            ₹50L - ₹1 Cr
          </button>
          <button
            type="button"
            onClick={() => handlePriceRangeChange(10000000, 990000000)}
            className="p-2 rounded-lg border border-slate-200 text-left hover:border-[#C5A059] font-medium text-slate-700"
          >
            Above ₹1 Cr
          </button>
        </div>
      </div>

      {/* Bedrooms (BHK) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-5 gap-1 text-xs">
          {bedroomsList.map((bhk) => {
            const isSelected = (!localFilters.bedrooms && bhk.id === "all") || localFilters.bedrooms === bhk.id;
            return (
              <button
                key={bhk.id}
                type="button"
                onClick={() => handleBedroomsChange(bhk.id)}
                className={`py-1.5 rounded-lg font-bold border transition-colors ${
                  isSelected
                    ? "bg-[#0B192C] text-white border-[#0B192C]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {bhk.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Checkboxes */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={!!localFilters.verifiedOnly}
            onChange={handleToggleVerified}
            className="rounded text-[#0B192C] focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Properties Only</span>
          </span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={!!localFilters.featuredOnly}
            onChange={handleToggleFeatured}
            className="rounded text-[#0B192C] focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Featured Properties Only</span>
          </span>
        </label>
      </div>

      {/* Apply button for mobile modal */}
      {isMobileModal && (
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={applyModalFilters}
            className="w-full py-3 bg-[#0B192C] text-white font-bold text-sm rounded-xl shadow-md"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
