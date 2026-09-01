"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  List,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  Compass,
} from "lucide-react";
import { getAllProperties } from "../../lib/storage";
import { Property, PropertyCategory } from "../../lib/types";
import { formatIndianCurrency, formatArea } from "../../lib/formatters";
import MapPropertyMarker from "../../components/map/MapPropertyMarker";

export default function MapSearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
    return true;
  });

  return (
    <div className="h-[calc(100vh-130px)] min-h-[600px] flex flex-col bg-slate-100">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 font-bold text-[#0B192C] text-sm">
              <Compass className="w-4 h-4 text-[#C5A059]" />
              <span>Map Discovery Mode</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing <strong>{filteredProperties.length}</strong> geocoded properties
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">All Cities</option>
              <option value="Raipur">Raipur</option>
              <option value="Naya Raipur">Naya Raipur</option>
              <option value="Bhilai">Bhilai</option>
              <option value="Durg">Durg</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="plot">Plots & Land</option>
              <option value="flat">Flats</option>
              <option value="villa">Villas</option>
              <option value="farm-land">Farm Land</option>
              <option value="commercial">Commercial</option>
            </select>

            <Link
              href="/properties"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#0B192C] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <List className="w-3.5 h-3.5" />
              <span>List Grid</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Split Discovery Canvas: Left Interactive Map, Right Property List Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Main Map Canvas Area */}
        <div className="flex-1 relative bg-slate-200 overflow-hidden">
          {/* Visual Vector Map Background */}
          <div
            className="absolute inset-0 bg-[#e5e9f0]"
            style={{
              backgroundImage:
                "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Road grid visual art */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 50,0 Q 250,200 450,150 T 850,400 T 1200,600"
              fill="none"
              stroke="#ffffff"
              strokeWidth="24"
            />
            <path
              d="M 50,0 Q 250,200 450,150 T 850,400 T 1200,600"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="14"
            />
            <line x1="200" y1="0" x2="200" y2="100%" stroke="#ffffff" strokeWidth="16" />
            <line x1="200" y1="0" x2="200" y2="100%" stroke="#94a3b8" strokeWidth="10" />
            <line x1="600" y1="0" x2="600" y2="100%" stroke="#ffffff" strokeWidth="16" />
            <line x1="600" y1="0" x2="600" y2="100%" stroke="#94a3b8" strokeWidth="10" />
            <circle cx="500" cy="300" r="140" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8,8" />
          </svg>

          {/* Map Center Coordinate HUD */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs">
            <span className="font-bold text-[#0B192C] block">Raipur Metropolitan Region</span>
            <span className="text-[11px] text-slate-500 font-mono">21.2514° N, 81.6599° E</span>
          </div>

          {/* Geocoded Property Markers Distributed Across Simulated Geography */}
          <div className="absolute inset-0 p-8 sm:p-12 overflow-hidden pointer-events-none">
            <div className="relative w-full h-full pointer-events-auto">
              {filteredProperties.map((property, idx) => {
                // Map actual lat/long to relative canvas coordinates
                // Raipur center lat ~21.25, lng ~81.65
                const minLat = 21.05;
                const maxLat = 21.3;
                const minLng = 81.25;
                const maxLng = 81.85;

                const topPercent = Math.max(
                  10,
                  Math.min(90, 100 - ((property.latitude - minLat) / (maxLat - minLat)) * 100)
                );
                const leftPercent = Math.max(
                  10,
                  Math.min(90, ((property.longitude - minLng) / (maxLng - minLng)) * 100)
                );

                return (
                  <div
                    key={property.id}
                    style={{
                      position: "absolute",
                      top: `${topPercent}%`,
                      left: `${leftPercent}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <MapPropertyMarker
                      property={property}
                      isActive={selectedProperty?.id === property.id}
                      onSelect={(p) => setSelectedProperty(p)}
                      onClose={() => setSelectedProperty(null)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Scrollable Property Sidebar */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-64 lg:h-full shrink-0 z-20">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Properties in View ({filteredProperties.length})
            </h3>
            <span className="text-[11px] text-[#C5A059] font-bold">Click marker to focus</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredProperties.map((p) => {
              const isSelected = selectedProperty?.id === p.id;
              const isRent = p.purpose === "rent";
              const img = p.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProperty(p)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? "bg-slate-50 border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <Image src={img} alt={p.title} fill className="object-cover" sizes="80px" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-black text-xs text-[#0B192C]">
                        {formatIndianCurrency(p.price, isRent)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {p.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C5A059] mr-0.5 shrink-0" />
                      <span>{p.locality}, {p.city}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
