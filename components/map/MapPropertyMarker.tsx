"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { Property } from "../../lib/types";
import { formatIndianCurrency } from "../../lib/formatters";

interface MapPropertyMarkerProps {
  property: Property;
  isActive: boolean;
  onSelect: (property: Property) => void;
  onClose: () => void;
}

export default function MapPropertyMarker({
  property,
  isActive,
  onSelect,
  onClose,
}: MapPropertyMarkerProps) {
  const isRent = property.purpose === "rent";
  const mainImage = property.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="relative">
      {/* Pin Bubble */}
      <button
        type="button"
        onClick={() => onSelect(property)}
        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all transform hover:scale-110 cursor-pointer ${
          isActive
            ? "bg-[#0B192C] text-white ring-4 ring-[#C5A059] scale-110 z-30"
            : "bg-white text-slate-900 border border-slate-300 hover:border-[#0B192C] z-10"
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
        <span>{formatIndianCurrency(property.price, isRent)}</span>
      </button>

      {/* Floating Preview Card on Active Marker */}
      {isActive && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
          <div className="relative aspect-video w-full bg-slate-100">
            <Image
              src={mainImage}
              alt={property.title}
              fill
              className="object-cover"
              sizes="288px"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-[#0B192C]/90 text-white text-xs font-black px-2 py-0.5 rounded-md">
              {formatIndianCurrency(property.price, isRent)}
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center text-[10px] text-slate-500 font-semibold mb-1">
              <MapPin className="w-3 h-3 text-[#C5A059] mr-0.5" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>
            <h4 className="font-bold text-slate-900 text-xs line-clamp-1 mb-2">
              {property.title}
            </h4>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                {property.category}
              </span>
              <Link
                href={`/property/${property.slug}`}
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B192C] hover:text-[#C5A059]"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
