import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  Sparkles,
} from "lucide-react";
import { initialProperties } from "../../../data/properties";
import PropertyGallery from "../../../components/property/PropertyGallery";
import PropertyInfo from "../../../components/property/PropertyInfo";
import ContactCard from "../../../components/property/ContactCard";
import EMICalculator from "../../../components/property/EMICalculator";
import GoogleMap from "../../../components/map/GoogleMap";
import PropertyCard from "../../../components/property/PropertyCard";
import { formatIndianCurrency } from "../../../lib/formatters";

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return initialProperties.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = initialProperties.find(
    (p) => p.slug === slug || p.id.toLowerCase() === slug.toLowerCase()
  );

  if (!property) {
    return {
      title: "Property Not Found | Tulya Finance",
    };
  }

  const isRent = property.purpose === "rent";
  const priceFormatted = formatIndianCurrency(property.price, isRent);

  return {
    title: `${property.title} in ${property.locality}, ${property.city} (${priceFormatted})`,
    description: property.shortDescription || property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} | Tulya Finance Properties`,
      description: property.shortDescription,
      images: property.images[0] ? [{ url: property.images[0] }] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { slug } = await params;
  const property = initialProperties.find(
    (p) => p.slug === slug || p.id.toLowerCase() === slug.toLowerCase()
  );

  if (!property) {
    notFound();
  }

  // Find similar properties in the same category or city
  const similarProperties = initialProperties
    .filter((p) => p.id !== property.id && (p.category === property.category || p.city === property.city))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-[#0B192C]">
          Home
        </Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-[#0B192C]">
          Properties
        </Link>
        <span>/</span>
        <Link href={`/properties/${property.category}`} className="hover:text-[#0B192C] capitalize">
          {property.category.replace("-", " ")}
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-xs">{property.title}</span>
      </nav>

      {/* Main Detail Grid (Gallery & Info Left, Sticky Contact Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Gallery, Property Info, EMI Calculator, Google Map */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <PropertyGallery
            images={property.images}
            title={property.title}
            verified={property.verified}
            featured={property.featured}
          />

          {/* Primary Info & Specifications */}
          <PropertyInfo property={property} />

          {/* Home Loan EMI Calculator */}
          <EMICalculator propertyPrice={property.price} />

          {/* Google Maps Exact Property Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Exact Coordinates
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Property Location & Neighborhood
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {property.latitude.toFixed(4)}°N, {property.longitude.toFixed(4)}°E
              </span>
            </div>

            <p className="text-xs text-slate-600">
              📍 <strong>Address:</strong> {property.address}
            </p>

            {/* GoogleMap Component */}
            <GoogleMap
              latitude={property.latitude}
              longitude={property.longitude}
              address={property.address}
              propertyTitle={property.title}
              zoom={16}
              height="380px"
            />
          </div>
        </div>

        {/* Right Column: Sticky Contact & Enquiry Card */}
        <div className="lg:col-span-1">
          <ContactCard property={property} />
        </div>
      </div>

      {/* Similar & Recommended Properties */}
      {similarProperties.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Recommended Opportunities
              </span>
              <h2 className="text-xl font-extrabold text-[#0B192C] mt-0.5">
                Similar Properties You May Like
              </h2>
            </div>
            <Link
              href="/properties"
              className="text-xs font-bold text-[#0B192C] hover:text-[#C5A059] transition-colors"
            >
              Browse All Listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarProperties.map((similar) => (
              <PropertyCard key={similar.id} property={similar} compact={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
