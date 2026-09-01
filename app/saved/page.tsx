"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, Home, Search } from "lucide-react";
import { getSavedPropertyIds, getAllProperties, toggleSaveProperty } from "../../lib/storage";
import { Property } from "../../lib/types";
import PropertyCard from "../../components/property/PropertyCard";

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadSaved = () => {
    const ids = getSavedPropertyIds();
    const all = getAllProperties();
    const filtered = all.filter((p) => ids.includes(p.id));
    setSavedProperties(filtered);
    setLoaded(true);
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener("tulya:saved-changed", loadSaved);
    return () => window.removeEventListener("tulya:saved-changed", loadSaved);
  }, []);

  const handleClearAll = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tulya_saved_properties", JSON.stringify([]));
      window.dispatchEvent(new CustomEvent("tulya:saved-changed", { detail: { count: 0 } }));
      setSavedProperties([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
              Saved & Shortlisted Properties
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Properties you've bookmarked for easy comparison and direct contact with Tulya advisors.
          </p>
        </div>

        {savedProperties.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Shortlist</span>
          </button>
        )}
      </div>

      {/* Content */}
      {loaded && savedProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs my-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Shortlisted Properties Yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon ❤️ on any plot, villa, or flat card while browsing to save properties here.
          </p>
          <div className="pt-2">
            <Link
              href="/properties"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Search className="w-4 h-4 text-[#C5A059]" />
              <span>Browse Properties Now</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
