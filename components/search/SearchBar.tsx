"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, SlidersHorizontal, IndianRupee } from "lucide-react";
import { chhattisgarhCities } from "../../data/locations";

interface SearchBarProps {
  initialValues?: {
    location?: string;
    category?: string;
    budget?: string;
    purpose?: "buy" | "rent";
  };
  compact?: boolean;
  onOpenFilterModal?: () => void;
}

export default function SearchBar({
  initialValues,
  compact = false,
  onOpenFilterModal,
}: SearchBarProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<"buy" | "rent">(initialValues?.purpose || "buy");
  const [location, setLocation] = useState(initialValues?.location || "");
  const [category, setCategory] = useState(initialValues?.category || "all");
  const [budget, setBudget] = useState(initialValues?.budget || "all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (purpose) params.set("purpose", purpose);
    if (location.trim()) params.set("location", location.trim());
    if (category && category !== "all") params.set("category", category);
    if (budget && budget !== "all") params.set("budget", budget);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-slate-200/90 shadow-md ${
        compact ? "p-3" : "p-4 sm:p-5"
      }`}
    >
      {/* Purpose Switch: Buy vs Rent */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl">
          <button
            type="button"
            onClick={() => setPurpose("buy")}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              purpose === "buy"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0B192C]"
            }`}
          >
            Buy Properties
          </button>
          <button
            type="button"
            onClick={() => setPurpose("rent")}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              purpose === "rent"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-[#0B192C]"
            }`}
          >
            Rent Properties
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>150+ Verified Listings in Chhattisgarh</span>
        </div>
      </div>

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Field 1: Location */}
        <div className="lg:col-span-4 relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors">
          <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mr-2.5" />
          <div className="flex flex-col flex-1 min-w-0">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Location / City
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Shankar Nagar, Naya Raipur"
              list="chhattisgarh-cities"
              className="bg-transparent text-sm font-semibold text-[#0B192C] focus:outline-none placeholder:text-slate-400 placeholder:font-normal"
            />
            <datalist id="chhattisgarh-cities">
              {chhattisgarhCities.map((city) => (
                <option key={city} value={city} />
              ))}
              <option value="Shankar Nagar" />
              <option value="VIP Road" />
              <option value="Kamal Vihar" />
              <option value="Telibandha" />
              <option value="Saddu" />
              <option value="Pandri" />
            </datalist>
          </div>
        </div>

        {/* Field 2: Property Type */}
        <div className="lg:col-span-3 relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors">
          <Home className="w-5 h-5 text-[#C5A059] shrink-0 mr-2.5" />
          <div className="flex flex-col flex-1 min-w-0">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Property Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#0B192C] focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="plot">Plots / Land</option>
              <option value="residential">Residential</option>
              <option value="flat">Flats / Apartments</option>
              <option value="villa">Villas / Bungalows</option>
              <option value="farm-land">Farm Land / Acreage</option>
              <option value="commercial">Commercial / Retail</option>
              <option value="project">New Projects</option>
              <option value="investment">Pre-leased / Investment</option>
            </select>
          </div>
        </div>

        {/* Field 3: Budget */}
        <div className="lg:col-span-3 relative flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors">
          <IndianRupee className="w-5 h-5 text-[#C5A059] shrink-0 mr-2.5" />
          <div className="flex flex-col flex-1 min-w-0">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Budget Range
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-transparent text-sm font-semibold text-[#0B192C] focus:outline-none cursor-pointer"
            >
              <option value="all">Any Budget</option>
              {purpose === "buy" ? (
                <>
                  <option value="0-2500000">Up to ₹25 Lakh</option>
                  <option value="2500000-5000000">₹25 Lakh - ₹50 Lakh</option>
                  <option value="5000000-10000000">₹50 Lakh - ₹1 Crore</option>
                  <option value="10000000-25000000">₹1 Crore - ₹2.5 Crore</option>
                  <option value="25000000-990000000">₹2.5 Crore+</option>
                </>
              ) : (
                <>
                  <option value="0-15000">Up to ₹15,000/mo</option>
                  <option value="15000-30000">₹15,000 - ₹30,000/mo</option>
                  <option value="30000-60000">₹30,000 - ₹60,000/mo</option>
                  <option value="60000-9900000">Above ₹60,000/mo</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Action: Search Button + Optional Filter Icon */}
        <div className="lg:col-span-2 flex items-center space-x-2">
          {onOpenFilterModal && (
            <button
              type="button"
              onClick={onOpenFilterModal}
              className="p-3.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#0B192C] hover:bg-slate-100 transition-colors"
              title="More Filters"
            >
              <SlidersHorizontal className="w-5 h-5 text-slate-600" />
            </button>
          )}
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-5 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm rounded-xl shadow-md transition-all group cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}
