"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Upload,
  Sparkles,
  MapPin,
  IndianRupee,
  Maximize2,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  Plus,
} from "lucide-react";
import { Property, PropertyCategory, PropertyPurpose } from "../../lib/types";
import { saveNewProperty } from "../../lib/storage";
import PropertyCard from "../../components/property/PropertyCard";
import { chhattisgarhCities } from "../../data/locations";

export default function PostPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdSlug, setCreatedSlug] = useState<string>("");

  // Form Fields State
  const [title, setTitle] = useState("Prime Residential Plot in Shankar Nagar");
  const [category, setCategory] = useState<PropertyCategory>("plot");
  const [purpose, setPurpose] = useState<PropertyPurpose>("buy");
  const [price, setPrice] = useState<number>(2800000);
  const [area, setArea] = useState<number>(1800);
  const [areaUnit, setAreaUnit] = useState<"Sq.Ft." | "Acres">("Sq.Ft.");
  const [city, setCity] = useState("Raipur");
  const [locality, setLocality] = useState("Shankar Nagar");
  const [address, setAddress] = useState("Plot 15, Green Meadows, Shankar Nagar, Raipur");
  const [latitude, setLatitude] = useState<number>(21.2514);
  const [longitude, setLongitude] = useState<number>(81.6599);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [facing, setFacing] = useState<string>("East");
  const [possession, setPossession] = useState<string>("Ready to Move");
  const [description, setDescription] = useState(
    "East-facing vastu compliant property located in prime neighborhood. 40ft wide road access, water and electricity connections available."
  );
  const [ownerName, setOwnerName] = useState("Chaitanya Garg");
  const [ownerPhone, setOwnerPhone] = useState("+91 98765 43210");
  const [ownerType, setOwnerType] = useState<"Owner" | "Builder" | "Certified Agent">("Owner");

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "24x7 Water Supply",
    "Electricity Connection",
    "40ft Asphalt Road",
    "Gated Perimeter",
  ]);

  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
  );

  const samplePhotoOptions = [
    { label: "Residential Plot", url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" },
    { label: "Modern Villa", url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" },
    { label: "Luxury Flat / Apartment", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
    { label: "Commercial Showroom", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
    { label: "Green Farm Land", url: "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80" },
  ];

  const availableAmenities = [
    "24x7 Water Supply",
    "Electricity Connection",
    "40ft Asphalt Road",
    "Gated Perimeter",
    "Clubhouse & Gym",
    "Swimming Pool",
    "Underground Drainage",
    "Street Lighting",
    "100% Power Backup",
    "CCTV Security",
    "Clear Title & Registry Ready",
    "TNCP Approved",
  ];

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Preview Property Object
  const previewProperty: Property = {
    id: `TF-CUST-${Date.now().toString().slice(-4)}`,
    propertyId: `TF-${category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    title: title || "Untitled Property Listing",
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4),
    category,
    purpose,
    price: price || 0,
    pricePerSqFt: area > 0 ? Math.round(price / area) : undefined,
    area: area || 0,
    areaUnit,
    city,
    locality,
    address,
    latitude,
    longitude,
    images: [selectedImageUrl],
    description,
    shortDescription: description.slice(0, 100),
    amenities: selectedAmenities,
    bedrooms: ["flat", "villa", "residential"].includes(category) ? bedrooms : undefined,
    bathrooms: ["flat", "villa", "residential"].includes(category) ? bathrooms : undefined,
    facing: facing as any,
    possession: possession as any,
    featured: false,
    verified: true,
    status: "published",
    createdAt: new Date().toISOString(),
    ownerName,
    ownerPhone,
    ownerType,
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveNewProperty(previewProperty);
    setCreatedSlug(previewProperty.slug);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Upfront Listing Fee</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
          Post Your Property on Tulya Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect directly with thousands of verified homebuyers and investors across Central India.
        </p>
      </div>

      {isSubmitted ? (
        /* Success Screen */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-md space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Property Published Successfully!</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your listing <strong>{previewProperty.title}</strong> is now live on Tulya Finance
            Marketplace and active in the inventory database.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono">
            Listing Reference ID: <strong>{previewProperty.propertyId}</strong>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/property/${createdSlug}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              View Live Property Page →
            </Link>
            <Link
              href="/admin"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
            >
              Manage in Admin Portal
            </Link>
          </div>
        </div>
      ) : (
        /* Multi-step Form + Live Card Preview */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form Wizard (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {[
                { s: 1, label: "Basic Info" },
                { s: 2, label: "Location & Coordinates" },
                { s: 3, label: "Amenities & Photos" },
                { s: 4, label: "Contact Details" },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setStep(item.s)}
                  className={`flex flex-col items-center space-y-1 ${
                    step === item.s
                      ? "text-[#0B192C] font-bold"
                      : step > item.s
                      ? "text-emerald-600 font-semibold"
                      : "text-slate-400"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === item.s
                        ? "bg-[#0B192C] text-white"
                        : step > item.s
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.s}
                  </div>
                  <span className="text-[10px] hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Premium 2000 Sq.Ft. Residential Plot"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Property Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    >
                      <option value="plot">Plots & Land</option>
                      <option value="residential">Residential</option>
                      <option value="flat">Flats / Apartments</option>
                      <option value="villa">Villas / Bungalows</option>
                      <option value="farm-land">Farm Land</option>
                      <option value="commercial">Commercial Space</option>
                      <option value="project">New Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Listing Purpose *
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    >
                      <option value="buy">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Total Price (₹ INR) *
                    </label>
                    <div className="relative flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Total Area *
                    </label>
                    <div className="flex space-x-1">
                      <input
                        type="number"
                        required
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-2/3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                      />
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as any)}
                        className="w-1/3 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                      >
                        <option value="Sq.Ft.">Sq.Ft.</option>
                        <option value="Acres">Acres</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>Next: Location Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Coordinates */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    >
                      {chhattisgarhCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Locality / Sector *
                    </label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Shankar Nagar, Sector 12"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Complete Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full street address and landmark"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                {/* Coordinates */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B192C]">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span>Google Maps Geocoded Coordinates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>Next: Amenities & Photos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Photos */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Photo Preset Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    Select Property Photo Showcase *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {samplePhotoOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedImageUrl(opt.url)}
                        className={`p-2 rounded-xl border text-left text-xs font-semibold transition-all ${
                          selectedImageUrl === opt.url
                            ? "border-[#C5A059] bg-[#C5A059]/10 text-[#0B192C] ring-2 ring-[#C5A059]/30"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Selection Checklist */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                    Features & Amenities Checklist
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {availableAmenities.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                            isChecked
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <span>{amenity}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    <span>Next: Owner Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact Details & Submit */}
            {step === 4 && (
              <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Your Name / Firm *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    You Are The:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["Owner", "Builder", "Certified Agent"] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setOwnerType(role)}
                        className={`p-2.5 rounded-xl border font-bold transition-colors ${
                          ownerType === role
                            ? "bg-[#0B192C] text-white border-[#0B192C]"
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Tulya Finance Quality Pledge:</strong> Listings submitted through this
                    portal undergo digital title check and are published instantly to prospective
                    buyers in Raipur & Chhattisgarh.
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-8 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4 text-[#C5A059]" />
                    <span>Publish Listing to Marketplace</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Live Interactive Card Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-3 sticky top-24">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live E-Commerce Preview
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                Auto-updating
              </span>
            </div>

            <PropertyCard property={previewProperty} />
          </div>
        </div>
      )}
    </div>
  );
}
