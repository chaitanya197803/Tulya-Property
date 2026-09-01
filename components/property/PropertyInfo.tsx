import {
  Maximize2,
  BedDouble,
  Bath,
  Compass,
  Calendar,
  Armchair,
  ShieldCheck,
  CheckCircle,
  Hash,
  FileCheck,
  Zap,
  Droplets,
  Car,
  TreePine,
  Wifi,
  Video,
} from "lucide-react";
import { Property } from "../../lib/types";
import { formatIndianCurrency, formatArea, formatPricePerSqFt } from "../../lib/formatters";

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const isRent = property.purpose === "rent";

  // Icon mapping for amenities
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("water") || lower.includes("borewell")) return Droplets;
    if (lower.includes("power") || lower.includes("electric") || lower.includes("solar")) return Zap;
    if (lower.includes("park") || lower.includes("garage") || lower.includes("car")) return Car;
    if (lower.includes("garden") || lower.includes("lawn") || lower.includes("tree")) return TreePine;
    if (lower.includes("wifi") || lower.includes("internet") || lower.includes("fiber")) return Wifi;
    if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return Video;
    return CheckCircle;
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* Title & Key Price Row */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B192C] text-white uppercase tracking-wider">
                {property.category.replace("-", " ")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                {isRent ? "For Rent" : "For Sale"}
              </span>
              {property.reraId && (
                <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>RERA: {property.reraId}</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {property.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center">
              <span>📍 {property.address}</span>
            </p>
          </div>

          {/* Pricing Box */}
          <div className="sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
            <div className="text-3xl font-black text-[#0B192C] tracking-tight">
              {formatIndianCurrency(property.price, isRent)}
            </div>
            {property.pricePerSqFt && !isRent && (
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Rate: {formatPricePerSqFt(property.price, property.area)}
              </div>
            )}
            <div className="text-[11px] text-slate-400 mt-1">
              Ref ID: <span className="font-mono font-bold text-slate-700">{property.propertyId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Grid Bar */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Overview & Key Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#C5A059] border border-slate-200 shrink-0">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Area</span>
              <span className="text-sm font-bold text-slate-900">
                {formatArea(property.area, property.areaUnit)}
              </span>
            </div>
          </div>

          {property.bedrooms ? (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#C5A059] border border-slate-200 shrink-0">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Configuration</span>
                <span className="text-sm font-bold text-slate-900">{property.bedrooms} BHK</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#C5A059] border border-slate-200 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Ownership</span>
                <span className="text-sm font-bold text-slate-900">Freehold Clear</span>
              </div>
            </div>
          )}

          {property.facing ? (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#C5A059] border border-slate-200 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Facing</span>
                <span className="text-sm font-bold text-slate-900">{property.facing}</span>
              </div>
            </div>
          ) : null}

          {property.possession ? (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#C5A059] border border-slate-200 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-500">Possession</span>
                <span className="text-sm font-bold text-emerald-700">{property.possession}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Description */}
      <div className="pt-2">
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <span>Property Description</span>
        </h2>
        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          {property.description}
        </div>
      </div>

      {/* Amenities & Features */}
      {property.amenities && property.amenities.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <span>Features & Amenities</span>
            <span className="text-xs font-normal text-slate-500">({property.amenities.length} Verified)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {property.amenities.map((amenity, idx) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Specifications Table */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Property Specifications</h2>
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
          <div className="grid grid-cols-2 p-3 bg-slate-50">
            <span className="font-semibold text-slate-500">Property Type</span>
            <span className="font-bold text-slate-900 capitalize">{property.category.replace("-", " ")}</span>
          </div>
          <div className="grid grid-cols-2 p-3 bg-white">
            <span className="font-semibold text-slate-500">Total Plot / Carpet Area</span>
            <span className="font-bold text-slate-900">{formatArea(property.area, property.areaUnit)}</span>
          </div>
          <div className="grid grid-cols-2 p-3 bg-slate-50">
            <span className="font-semibold text-slate-500">City & Locality</span>
            <span className="font-bold text-slate-900">{property.locality}, {property.city}</span>
          </div>
          {property.furnishing && (
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="font-semibold text-slate-500">Furnishing Status</span>
              <span className="font-bold text-slate-900">{property.furnishing}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="grid grid-cols-2 p-3 bg-slate-50">
              <span className="font-semibold text-slate-500">Bathrooms</span>
              <span className="font-bold text-slate-900">{property.bathrooms} Luxury Baths</span>
            </div>
          )}
          {property.balconies && (
            <div className="grid grid-cols-2 p-3 bg-white">
              <span className="font-semibold text-slate-500">Balconies</span>
              <span className="font-bold text-slate-900">{property.balconies} Balconies</span>
            </div>
          )}
          <div className="grid grid-cols-2 p-3 bg-slate-50">
            <span className="font-semibold text-slate-500">Legal Clearances</span>
            <span className="font-bold text-emerald-700">RERA Registered • TNCP Clear • Freehold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
