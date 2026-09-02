"use client";

import { useEffect, useState } from "react";
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
  X,
  Image as ImageIcon,
} from "lucide-react";

import {
  Property,
  PropertyCategory,
  PropertyPurpose,
} from "../../lib/types";

import { saveNewProperty } from "../../lib/storage";
import PropertyCard from "../../components/property/PropertyCard";
import { chhattisgarhCities } from "../../data/locations";

export default function PostPropertyPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdSlug, setCreatedSlug] = useState<string>("");

  // =========================================================
  // FORM STATE
  // =========================================================

  const [title, setTitle] = useState(
    "Prime Residential Plot in Shankar Nagar"
  );

  const [category, setCategory] =
    useState<PropertyCategory>("plot");

  const [purpose, setPurpose] =
    useState<PropertyPurpose>("buy");

  const [price, setPrice] = useState<number>(2800000);

  const [area, setArea] = useState<number>(1800);

  const [areaUnit, setAreaUnit] =
    useState<"Sq.Ft." | "Acres">("Sq.Ft.");

  const [city, setCity] = useState("Raipur");

  const [locality, setLocality] =
    useState("Shankar Nagar");

  const [address, setAddress] = useState(
    "Plot 15, Green Meadows, Shankar Nagar, Raipur"
  );

  const [latitude, setLatitude] =
    useState<number>(21.2514);

  const [longitude, setLongitude] =
    useState<number>(81.6599);

  const [bedrooms, setBedrooms] =
    useState<number>(3);

  const [bathrooms, setBathrooms] =
    useState<number>(3);

  const [facing, setFacing] =
    useState<string>("East");

  const [possession, setPossession] =
    useState<string>("Ready to Move");

  const [description, setDescription] = useState(
    "East-facing vastu compliant property located in prime neighborhood. 40ft wide road access, water and electricity connections available."
  );

  const [ownerName, setOwnerName] =
    useState("Chaitanya Garg");

  const [ownerPhone, setOwnerPhone] =
    useState("+91 98765 43210");

  const [ownerType, setOwnerType] =
    useState<"Owner" | "Builder" | "Certified Agent">(
      "Owner"
    );

  // =========================================================
  // AMENITIES
  // =========================================================

  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>([
      "24x7 Water Supply",
      "Electricity Connection",
      "40ft Asphalt Road",
      "Gated Perimeter",
    ]);

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
      prev.includes(name)
        ? prev.filter((a) => a !== name)
        : [...prev, name]
    );
  };

  // =========================================================
  // MULTIPLE IMAGE UPLOAD
  // =========================================================

  const [propertyImages, setPropertyImages] =
    useState<string[]>([]);

  const [coverImageIndex, setCoverImageIndex] =
    useState<number>(0);

  const MAX_IMAGES = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots =
      MAX_IMAGES - propertyImages.length;

    if (remainingSlots <= 0) {
      alert(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      e.target.value = "";
      return;
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots
    );

    const invalidFiles = selectedFiles.filter(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      alert(
        "Please upload only JPG, PNG or WEBP images under 5MB each."
      );

      e.target.value = "";
      return;
    }

    const newImages = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPropertyImages((prev) => [
      ...prev,
      ...newImages,
    ]);

    e.target.value = "";
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const removeImage = (index: number) => {
    const imageToRemove = propertyImages[index];

    if (imageToRemove?.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove);
    }

    setPropertyImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setCoverImageIndex((prev) => {
      if (index === prev) {
        return 0;
      }

      if (index < prev) {
        return Math.max(0, prev - 1);
      }

      return prev;
    });
  };

  // =========================================================
  // CLEANUP OBJECT URLS
  // =========================================================

  useEffect(() => {
    return () => {
      propertyImages.forEach((image) => {
        if (image.startsWith("blob:")) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, []);

  // =========================================================
  // MOVE COVER IMAGE TO FIRST POSITION
  // =========================================================

  const orderedImages =
    propertyImages.length > 0
      ? [
        propertyImages[coverImageIndex],
        ...propertyImages.filter(
          (_, index) => index !== coverImageIndex
        ),
      ]
      : [];

  // =========================================================
  // PREVIEW PROPERTY
  // =========================================================

  const previewProperty: Property = {
    id: `TF-CUST-${Date.now()
      .toString()
      .slice(-4)}`,

    propertyId: `TF-${category
      .substring(0, 3)
      .toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`,

    title:
      title || "Untitled Property Listing",

    slug:
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Date.now().toString().slice(-4),

    category,

    purpose,

    price: price || 0,

    pricePerSqFt:
      area > 0
        ? Math.round(price / area)
        : undefined,

    area: area || 0,

    areaUnit,

    city,

    locality,

    address,

    latitude,

    longitude,

    images: orderedImages,

    description,

    shortDescription:
      description.slice(0, 100),

    amenities: selectedAmenities,

    bedrooms: [
      "flat",
      "villa",
      "residential",
    ].includes(category)
      ? bedrooms
      : undefined,

    bathrooms: [
      "flat",
      "villa",
      "residential",
    ].includes(category)
      ? bathrooms
      : undefined,

    facing: facing as any,

    possession: possession as any,

    featured: false,

    verified: true,

    status: "published",

    createdAt:
      new Date().toISOString(),

    ownerName,

    ownerPhone,

    ownerType,
  };

  // =========================================================
  // FINAL SUBMIT
  // =========================================================

  const handleFinalSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (propertyImages.length === 0) {
      alert(
        "Please upload at least one property photo."
      );

      setStep(3);

      return;
    }

    if (!title.trim()) {
      alert("Please enter property title.");

      setStep(1);

      return;
    }

    if (!price || price <= 0) {
      alert("Please enter a valid property price.");

      setStep(1);

      return;
    }

    if (!area || area <= 0) {
      alert("Please enter a valid property area.");

      setStep(1);

      return;
    }

    saveNewProperty(previewProperty);

    setCreatedSlug(previewProperty.slug);

    setIsSubmitted(true);
  };

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (isSubmitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
            <Sparkles className="w-3.5 h-3.5" />

            <span>
              Zero Upfront Listing Fee
            </span>
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
            Post Your Property on Property Engine Marketplace
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Connect directly with thousands of
            verified homebuyers and investors across
            Central India.
          </p>
        </div>

        {/* Success */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-md space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Property Published Successfully!
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your listing{" "}
            <strong>
              {previewProperty.title}
            </strong>{" "}
            is now live on Property Engine Marketplace
            and active in the inventory database.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono">
            Listing Reference ID:{" "}
            <strong>
              {previewProperty.propertyId}
            </strong>
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
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
          <Sparkles className="w-3.5 h-3.5" />

          <span>
            Zero Upfront Listing Fee
          </span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C]">
          Post Your Property on Property Engine Marketplace
        </h1>

        <p className="text-xs sm:text-sm text-slate-500">
          Connect directly with thousands of verified
          homebuyers and investors across Central India.
        </p>
      </div>

      {/* ================================================= */}
      {/* FORM + PREVIEW */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ================================================= */}
        {/* LEFT FORM */}
        {/* ================================================= */}

        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">

          {/* STEP INDICATORS */}

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            {[
              {
                s: 1,
                label: "Basic Info",
              },
              {
                s: 2,
                label: "Location & Coordinates",
              },
              {
                s: 3,
                label: "Amenities & Photos",
              },
              {
                s: 4,
                label: "Contact Details",
              },
            ].map((item) => (
              <button
                key={item.s}
                type="button"
                onClick={() =>
                  setStep(item.s)
                }
                className={`flex flex-col items-center space-y-1 ${step === item.s
                    ? "text-[#0B192C] font-bold"
                    : step > item.s
                      ? "text-emerald-600 font-semibold"
                      : "text-slate-400"
                  }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === item.s
                      ? "bg-[#0B192C] text-white"
                      : step > item.s
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {item.s}
                </div>

                <span className="text-[10px] hidden sm:inline">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* ================================================= */}
          {/* STEP 1 */}
          {/* ================================================= */}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">

              {/* TITLE */}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Property Title *
                </label>

                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Premium 2000 Sq.Ft. Residential Plot"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              {/* CATEGORY + PURPOSE */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Property Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as PropertyCategory
                      )
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="plot">
                      Plots & Land
                    </option>

                    <option value="residential">
                      Residential
                    </option>

                    <option value="flat">
                      Flats / Apartments
                    </option>

                    <option value="villa">
                      Villas / Bungalows
                    </option>

                    <option value="farm-land">
                      Farm Land
                    </option>

                    <option value="commercial">
                      Commercial Space
                    </option>

                    <option value="project">
                      New Project
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Listing Purpose *
                  </label>

                  <select
                    value={purpose}
                    onChange={(e) =>
                      setPurpose(
                        e.target.value as PropertyPurpose
                      )
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="buy">
                      For Sale
                    </option>

                    <option value="rent">
                      For Rent
                    </option>
                  </select>
                </div>

              </div>

              {/* PRICE + AREA */}

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
                      min="0"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          Number(e.target.value)
                        )
                      }
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
                      min="0"
                      value={area}
                      onChange={(e) =>
                        setArea(
                          Number(e.target.value)
                        )
                      }
                      className="w-2/3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />

                    <select
                      value={areaUnit}
                      onChange={(e) =>
                        setAreaUnit(
                          e.target.value as
                          | "Sq.Ft."
                          | "Acres"
                        )
                      }
                      className="w-1/3 px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                    >
                      <option value="Sq.Ft.">
                        Sq.Ft.
                      </option>

                      <option value="Acres">
                        Acres
                      </option>
                    </select>

                  </div>
                </div>

              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Describe your property..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              {/* NEXT */}

              <div className="pt-2 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setStep(2)
                  }
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <span>
                    Next: Location Details
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* STEP 2 */}
          {/* ================================================= */}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">

              {/* CITY + LOCALITY */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    City *
                  </label>

                  <select
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    {chhattisgarhCities.map(
                      (c) => (
                        <option
                          key={c}
                          value={c}
                        >
                          {c}
                        </option>
                      )
                    )}
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
                    onChange={(e) =>
                      setLocality(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Shankar Nagar, Sector 12"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

              </div>

              {/* ADDRESS */}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Complete Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="Full street address and landmark"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              {/* COORDINATES */}

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">

                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0B192C]">

                  <MapPin className="w-4 h-4 text-[#C5A059]" />

                  <span>
                    Google Maps Geocoded Coordinates
                  </span>

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
                      onChange={(e) =>
                        setLatitude(
                          Number(
                            e.target.value
                          )
                        )
                      }
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
                      onChange={(e) =>
                        setLongitude(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    />
                  </div>

                </div>

              </div>

              {/* NAVIGATION */}

              <div className="pt-2 flex justify-between">

                <button
                  type="button"
                  onClick={() =>
                    setStep(1)
                  }
                  className="inline-flex items-center gap-1 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />

                  Back
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStep(3)
                  }
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <span>
                    Next: Amenities & Photos
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* STEP 3 */}
          {/* ================================================= */}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">

              {/* ============================================= */}
              {/* IMAGE UPLOAD */}
              {/* ============================================= */}

              <div>

                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Property Photos *
                </label>

                <p className="text-[11px] text-slate-500 mb-3">
                  Upload multiple photos of your
                  property. Add exterior, interior,
                  road, location and other important
                  photos.
                </p>

                {/* UPLOAD BOX */}

                {propertyImages.length <
                  MAX_IMAGES && (
                    <label
                      htmlFor="property-images"
                      className="flex flex-col items-center justify-center w-full min-h-40 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#C5A059] cursor-pointer transition-all"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-3">
                        <Upload className="w-7 h-7 text-[#C5A059]" />
                      </div>

                      <span className="text-xs font-bold text-slate-800">
                        Click to Upload Property Photos
                      </span>

                      <span className="text-[10px] text-slate-500 mt-1">
                        JPG, PNG or WEBP
                      </span>

                      <span className="text-[10px] text-slate-400 mt-1">
                        Maximum 5MB per image
                      </span>

                      <span className="text-[10px] font-semibold text-[#C5A059] mt-2">
                        {propertyImages.length}/
                        {MAX_IMAGES} photos selected
                      </span>

                      <input
                        id="property-images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={
                          handleImageUpload
                        }
                        className="hidden"
                      />
                    </label>
                  )}

                {/* MAX IMAGE MESSAGE */}

                {propertyImages.length >=
                  MAX_IMAGES && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      You have reached the maximum
                      limit of {MAX_IMAGES} images.
                    </div>
                  )}

              </div>

              {/* ============================================= */}
              {/* IMAGE PREVIEW */}
              {/* ============================================= */}

              {propertyImages.length > 0 && (
                <div>

                  <div className="flex items-center justify-between mb-3">

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        Uploaded Photos
                      </label>

                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Click any image to make it
                        the cover photo.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-semibold">
                      <ImageIcon className="w-3 h-3" />

                      {propertyImages.length}/
                      {MAX_IMAGES}
                    </div>

                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                    {propertyImages.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className={`relative group rounded-xl overflow-hidden border-2 transition-all ${coverImageIndex ===
                              index
                              ? "border-[#C5A059] ring-2 ring-[#C5A059]/30"
                              : "border-slate-200"
                            }`}
                        >

                          {/* IMAGE */}

                          <button
                            type="button"
                            onClick={() =>
                              setCoverImageIndex(
                                index
                              )
                            }
                            className="block w-full aspect-4/3"
                          >
                            <img
                              src={image}
                              alt={`Property photo ${index + 1
                                }`}
                              className="w-full h-full object-cover"
                            />
                          </button>

                          {/* COVER */}

                          {coverImageIndex ===
                            index && (
                              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#C5A059] text-white text-[8px] font-extrabold">
                                COVER PHOTO
                              </div>
                            )}

                          {/* NUMBER */}

                          <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            aria-label={`Remove photo ${index + 1
                              }`}
                          >
                            <X className="w-4 h-4" />
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

              {/* EMPTY IMAGE WARNING */}

              {propertyImages.length ===
                0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">

                    <ImageIcon className="w-5 h-5 text-amber-600 shrink-0" />

                    <div className="text-[11px] text-amber-800">
                      <strong>
                        Property photo required
                      </strong>

                      <p className="mt-1">
                        Please upload at least one
                        photo before publishing your
                        property.
                      </p>
                    </div>

                  </div>
                )}

              {/* ============================================= */}
              {/* AMENITIES */}
              {/* ============================================= */}

              <div>

                <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                  Features & Amenities Checklist
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">

                  {availableAmenities.map(
                    (amenity) => {
                      const isChecked =
                        selectedAmenities.includes(
                          amenity
                        );

                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() =>
                            toggleAmenity(
                              amenity
                            )
                          }
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${isChecked
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                        >
                          <span>
                            {amenity}
                          </span>

                          {isChecked && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* NAVIGATION */}

              <div className="pt-2 flex justify-between">

                <button
                  type="button"
                  onClick={() =>
                    setStep(2)
                  }
                  className="inline-flex items-center gap-1 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />

                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      propertyImages.length ===
                      0
                    ) {
                      alert(
                        "Please upload at least one property photo."
                      );

                      return;
                    }

                    setStep(4);
                  }}
                  className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <span>
                    Next: Owner Contact
                  </span>

                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>
          )}

          {/* ================================================= */}
          {/* STEP 4 */}
          {/* ================================================= */}

          {step === 4 && (
            <form
              onSubmit={handleFinalSubmit}
              className="space-y-4 animate-in fade-in duration-150"
            >

              {/* OWNER NAME + PHONE */}

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your Name / Firm *
                  </label>

                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) =>
                      setOwnerName(
                        e.target.value
                      )
                    }
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
                    onChange={(e) =>
                      setOwnerPhone(
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

              </div>

              {/* OWNER TYPE */}

              <div>

                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  You Are The:
                </label>

                <div className="grid grid-cols-3 gap-2 text-xs">

                  {(
                    [
                      "Owner",
                      "Builder",
                      "Certified Agent",
                    ] as const
                  ).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        setOwnerType(role)
                      }
                      className={`p-2.5 rounded-xl border font-bold transition-colors ${ownerType === role
                          ? "bg-[#0B192C] text-white border-[#0B192C]"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                    >
                      {role}
                    </button>
                  ))}

                </div>

              </div>

              {/* PHOTO SUMMARY */}

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">

                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#C5A059]" />

                    <span className="text-xs font-bold text-slate-800">
                      Property Photos
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-600">
                    {propertyImages.length} Photos
                  </span>

                </div>

                <div className="flex gap-2 overflow-x-auto">

                  {orderedImages.map(
                    (image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="relative shrink-0"
                      >
                        <img
                          src={image}
                          alt={`Property ${index + 1
                            }`}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />

                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 right-1 text-center bg-[#C5A059] text-white text-[7px] font-bold rounded">
                            COVER
                          </span>
                        )}
                      </div>
                    )
                  )}

                </div>

              </div>

              {/* QUALITY PLEDGE */}

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start space-x-3 text-xs text-emerald-800">

                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />

                <div>
                  <strong>
                    Property Engine Quality Pledge:
                  </strong>

                  <p className="mt-1">
                    Listings submitted through this
                    portal undergo digital title check
                    and are published instantly to
                    prospective buyers in Raipur &
                    Chhattisgarh.
                  </p>
                </div>

              </div>

              {/* NAVIGATION */}

              <div className="pt-2 flex justify-between">

                <button
                  type="button"
                  onClick={() =>
                    setStep(3)
                  }
                  className="inline-flex items-center gap-1 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />

                  Back
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 text-[#C5A059]" />

                  <span>
                    Publish Listing to Marketplace
                  </span>
                </button>

              </div>

            </form>
          )}

        </div>

        {/* ================================================= */}
        {/* RIGHT PREVIEW */}
        {/* ================================================= */}

        <div className="lg:col-span-5 space-y-3 sticky top-24">

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live E-Commerce Preview
            </span>

            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
              Auto-updating
            </span>

          </div>

          {/* IMAGE COUNT */}

          {propertyImages.length > 0 && (
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2">

              <div className="flex items-center gap-2">

                <ImageIcon className="w-4 h-4 text-[#C5A059]" />

                <span className="text-xs font-semibold text-slate-700">
                  {propertyImages.length} property{" "}
                  {propertyImages.length === 1
                    ? "photo"
                    : "photos"}
                </span>

              </div>

              <span className="text-[10px] text-slate-400">
                Cover photo selected
              </span>

            </div>
          )}

          {/* PROPERTY CARD */}

          <PropertyCard
            property={previewProperty}
          />

        </div>

      </div>

    </div>
  );
}