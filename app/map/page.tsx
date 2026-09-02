"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  List,
  Compass,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { getAllProperties } from "../../lib/storage";
import { Property } from "../../lib/types";
import { formatIndianCurrency } from "../../lib/formatters";

// Dynamically load the real Google Map component on client side
const InteractiveLeafletMap = dynamic(
  () => import("../../components/map/InteractiveLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#0B192C] border-t-[#C5A059] rounded-full animate-spin" />
        <div className="text-xs font-bold text-slate-600">Loading Google Maps live view...</div>
      </div>
    ),
  }
);

export default function MapSearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all");
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  const sidebarListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = getAllProperties();
    setProperties(all);
    if (all.length > 0) {
      setSelectedProperty(all[0]);
    }
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (selectedCity !== "all" && !p.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "all" && p.category !== selectedCategory) {
      return false;
    }
    if (selectedPurpose !== "all" && p.purpose !== selectedPurpose) {
      return false;
    }
    return true;
  });

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    // Scroll item in sidebar
    const el = document.getElementById(`sidebar-item-${property.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="h-[calc(100vh-70px)] min-h-150 flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Marketplace Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Headline & Count */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 font-black text-[#0B192C] text-sm tracking-tight">
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>Google Maps Discovery</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
              Showing <strong>{filteredProperties.length}</strong> verified properties
            </span>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            {/* Purpose Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPurpose("all")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedPurpose === "all" ? "bg-[#0B192C] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedPurpose("buy")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedPurpose === "buy" ? "bg-[#0B192C] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSelectedPurpose("rent")}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedPurpose === "rent" ? "bg-[#0B192C] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Rent
              </button>
            </div>

            {/* City Dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none shrink-0"
            >
              <option value="all">All Cities</option>
              <option value="Raipur">Raipur</option>
              <option value="Naya Raipur">Naya Raipur</option>
              <option value="Bhilai">Bhilai</option>
              <option value="Durg">Durg</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none shrink-0"
            >
              <option value="all">All Categories</option>
              <option value="plot">Plots & Land</option>
              <option value="flat">Flats</option>
              <option value="villa">Villas</option>
              <option value="farm-land">Farm Land</option>
              <option value="commercial">Commercial</option>
            </select>

            {/* Mobile View Toggle */}
            <div className="flex md:hidden items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setMobileTab("map")}
                className={`px-2.5 py-1 rounded-lg ${mobileTab === "map" ? "bg-[#0B192C] text-white" : "text-slate-600"}`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("list")}
                className={`px-2.5 py-1 rounded-lg ${mobileTab === "list" ? "bg-[#0B192C] text-white" : "text-slate-600"}`}
              >
                List ({filteredProperties.length})
              </button>
            </div>

            {/* Switch to List Grid */}
            <Link
              href="/properties"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#0B192C] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
            >
              <List className="w-3.5 h-3.5" />
              <span>List Grid</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Real Interactive Google Map */}
        <div
          className={`flex-1 relative h-full ${
            mobileTab === "list" ? "hidden md:block" : "block"
          }`}
        >
          <InteractiveLeafletMap
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={handleSelectProperty}
            selectedCity={selectedCity}
            className="w-full h-full"
          />
        </div>

        {/* Right Side: Synchronized Property Sidebar */}
        <div
          className={`w-full md:w-96 lg:w-105 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col shrink-0 z-20 ${
            mobileTab === "map" ? "hidden md:flex" : "flex"
          } h-full overflow-hidden`}
        >
          {/* Sidebar Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Properties in View ({filteredProperties.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Click a property to zoom and highlight on map
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#C5A059] bg-[#fbf5e8] px-2 py-0.5 rounded border border-[#f0dcab]">
              RERA Verified
            </span>
          </div>

          {/* Sidebar Scrollable List */}
          <div
            ref={sidebarListRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-slate-100"
          >
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No properties found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your city or category filters.
                </p>
              </div>
            ) : (
              filteredProperties.map((p) => {
                const isSelected = selectedProperty?.id === p.id;
                const isRent = p.purpose === "rent";
                const img =
                  p.images[0] ||
                  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";

                return (
                  <div
                    key={p.id}
                    id={`sidebar-item-${p.id}`}
                    onClick={() => handleSelectProperty(p)}
                    className={`pt-3 first:pt-0 transition-all cursor-pointer`}
                  >
                    <div
                      className={`p-3 rounded-2xl border transition-all flex space-x-3.5 ${
                        isSelected
                          ? "bg-slate-50 border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-md scale-[1.01]"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                        <span
                          className={`absolute top-1 left-1 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded text-white ${
                            isRent ? "bg-sky-600" : "bg-[#0B192C]"
                          }`}
                        >
                          {p.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-black text-sm text-[#0B192C]">
                              {formatIndianCurrency(p.price, isRent)}
                            </span>
                            {p.verified && (
                              <span className="inline-flex items-center text-[10px] font-bold text-emerald-600">
                                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 text-[#C5A059] mr-0.5 shrink-0" />
                            <span>
                              {p.locality}, {p.city}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <span className="text-slate-500 font-medium">
                            {p.area} {p.areaUnit}
                          </span>
                          <Link
                            href={`/property/${p.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-[#0B192C] font-bold hover:text-[#C5A059] transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
