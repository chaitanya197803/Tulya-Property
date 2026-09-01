"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  PhoneCall,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Percent,
  PlusCircle,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import CategoryScroll from "../components/property/CategoryScroll";
import PropertyGrid from "../components/property/PropertyGrid";
import { getAllProperties } from "../lib/storage";
import { topLocalities } from "../data/locations";
import { Property, PropertyCategory } from "../lib/types";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    setProperties(getAllProperties());

    const handlePropUpdate = () => {
      setProperties(getAllProperties());
    };

    window.addEventListener("tulya:property-added", handlePropUpdate);
    window.addEventListener("tulya:property-updated", handlePropUpdate);
    return () => {
      window.removeEventListener("tulya:property-added", handlePropUpdate);
      window.removeEventListener("tulya:property-updated", handlePropUpdate);
    };
  }, []);

  // Featured Properties for immediate top spotlight
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 4);

  // Tab filtered properties for the Latest Marketplace section
  const tabFilteredProperties =
    activeTab === "all"
      ? properties.slice(0, 8)
      : properties.filter((p) => p.category === activeTab).slice(0, 8);

  const tabs: { id: string; label: string }[] = [
    { id: "all", label: "All Properties" },
    { id: "plot", label: "Plots & Land" },
    { id: "flat", label: "Flats & Apartments" },
    { id: "villa", label: "Villas" },
    { id: "farm-land", label: "Farm Land" },
    { id: "commercial", label: "Commercial" },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. TOP MARKETPLACE SEARCH & QUICK DISCOVERY BAR */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200/80 pt-5 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Header headline tag */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
                Discover Verified Real Estate in Central India
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Browse verified residential plots, luxury villas, flats, and commercial properties.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RERA & TNCP Approved</span>
              </span>
            </div>
          </div>

          {/* Compact Marketplace Search Component */}
          <SearchBar />

          {/* 2. PROPERTY CATEGORIES HORIZONTAL PILLS */}
          <div className="pt-2">
            <CategoryScroll />
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES SPOTLIGHT (Immediate 4-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B192C]">
                Featured Property Opportunities
              </h2>
              <p className="text-xs text-slate-500">Hand-picked premium listings with high appreciation potential</p>
            </div>
          </div>

          <Link
            href="/properties?featured=true"
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B192C] hover:text-[#C5A059] transition-colors"
          >
            <span>View All ({featuredProperties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PropertyGrid properties={featuredProperties} />
      </section>

      {/* 4. LATEST PROPERTIES WITH INTERACTIVE CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0B192C]">
              Latest Market Listings
            </h2>
            <p className="text-xs text-slate-500">Fresh properties listed directly by owners, builders, and certified desks</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-[#0B192C] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <PropertyGrid properties={tabFilteredProperties} />

        <div className="mt-8 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <span>Explore All {properties.length}+ Verified Properties</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </Link>
        </div>
      </section>

      {/* 5. EXPLORE BY TOP LOCALITIES IN CHHATTISGARH */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Neighborhood Discovery
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B192C] mt-0.5">
                Explore Top Localities in Raipur & Central India
              </h2>
            </div>
            <Link
              href="/map"
              className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-[#0B192C] hover:text-[#C5A059]"
            >
              <span>View Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topLocalities.map((loc) => (
              <Link
                key={loc.name}
                href={`/properties?location=${encodeURIComponent(loc.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-slate-900 shadow-xs hover:shadow-md transition-all"
              >
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/40 to-transparent" />

                <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                    {loc.city}
                  </span>
                  <h3 className="font-bold text-xs line-clamp-1 group-hover:text-[#C5A059] transition-colors">
                    {loc.name}
                  </h3>
                  <div className="text-[10px] text-slate-300 font-medium mt-1">
                    {loc.propertyCount} Properties
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY TULYA FINANCE (Trust & Value Indicators) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              The Tulya Finance Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
              Why Smart Buyers & Investors Choose Tulya Finance
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We combine cutting-edge property discovery with transparent title verification and
              seamless fintech loan advisory to make property buying secure and straightforward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">✓ Verified Properties</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every listed plot, villa, and flat undergoes rigorous RERA and municipal registry check.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">✓ Transparent Details</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Accurate geocoded coordinates, clear carpet areas, and breakdown of all statutory fees.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">✓ Easy Home Loan Advisory</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant loan eligibility assessment and doorstep processing with premier banking partners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">✓ Direct Customer Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated local advisors in Raipur for site visits, negotiations, and documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SELLER & BUILDER CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white p-8 sm:p-12 border border-[#C5A059]/30 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
            <Building2 className="w-full h-full text-[#C5A059]" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Are You an Owner, Builder or Certified Agent?</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Post Your Property on Tulya Finance Marketplace For Free
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach thousands of active homebuyers and real-estate investors across Raipur,
              Bhilai, Durg, and Central India. Fast listing process with zero upfront fee.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/post-property"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#C5A059] hover:bg-[#b38b42] text-[#0B192C] font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Free Property Listing</span>
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#C5A059]" />
                <span>Agent Support: +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
