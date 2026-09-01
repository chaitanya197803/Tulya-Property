"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Property } from "../../lib/types";
import { formatIndianCurrency, formatArea, formatPricePerSqFt, generateWhatsAppLink } from "../../lib/formatters";
import { isPropertySaved, toggleSaveProperty } from "../../lib/storage";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export default function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPropertySaved(property.id));
    const handleSavedChange = () => setSaved(isPropertySaved(property.id));
    window.addEventListener("tulya:saved-changed", handleSavedChange);
    return () => window.removeEventListener("tulya:saved-changed", handleSavedChange);
  }, [property.id]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveProperty(property.id);
    setSaved(newState);
  };

  const whatsappUrl = generateWhatsAppLink(
    property.ownerPhone || "+919876543210",
    property.title,
    property.propertyId
  );

  const isRent = property.purpose === "rent";
  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container with Badges & Heart */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100">
        <Link href={`/property/${property.slug}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            {property.verified && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs backdrop-blur-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
            {property.featured && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C5A059] text-white shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md uppercase tracking-wider">
              {property.category.replace("-", " ")}
            </span>
          </div>

          {/* Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              saved
                ? "bg-rose-500 text-white shadow-md scale-110"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500"
            }`}
            title={saved ? "Remove from Shortlist" : "Save Property"}
          >
            <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Bottom Price Tag on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
          <div className="bg-[#0B192C]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 shadow-md">
            <span className="text-lg font-black text-[#C5A059] tracking-tight">
              {formatIndianCurrency(property.price, isRent)}
            </span>
            {property.pricePerSqFt && !isRent && (
              <span className="block text-[10px] text-slate-300 font-medium">
                {formatPricePerSqFt(property.price, property.area)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold bg-white/90 text-[#0B192C] px-2.5 py-1 rounded-lg backdrop-blur-xs shadow-xs uppercase">
            {property.purpose === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059] mr-1 shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Title */}
          <Link href={`/property/${property.slug}`} className="block group-hover:text-[#1E3E62] transition-colors">
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          {/* Short Description */}
          {!compact && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
              {property.shortDescription || property.description}
            </p>
          )}

          {/* Key Specs Pills */}
          <div className="flex items-center space-x-3 py-2 border-y border-slate-100 text-xs text-slate-700 font-medium">
            <div className="flex items-center space-x-1" title="Plot/Carpet Area">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatArea(property.area, property.areaUnit)}</span>
            </div>

            {property.bedrooms ? (
              <div className="flex items-center space-x-1" title="Bedrooms">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} BHK</span>
              </div>
            ) : null}

            {property.bathrooms ? (
              <div className="flex items-center space-x-1" title="Bathrooms">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            ) : null}

            {property.possession && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold ml-auto">
                {property.possession}
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-2 flex items-center space-x-2">
          <Link
            href={`/property/${property.slug}`}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-slate-100 hover:bg-[#0B192C] text-[#0B192C] hover:text-white rounded-xl text-xs font-bold transition-all group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
