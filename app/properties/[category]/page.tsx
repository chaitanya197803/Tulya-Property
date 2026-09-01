import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";
import { propertyCategories } from "../../../data/categories";
import { initialProperties } from "../../../data/properties";
import PropertyGrid from "../../../components/property/PropertyGrid";
import CategoryScroll from "../../../components/property/CategoryScroll";
import { PropertyCategory } from "../../../lib/types";

// Category slug to internal ID mapping
const slugToCategoryMap: Record<string, PropertyCategory> = {
  plots: "plot",
  plot: "plot",
  residential: "residential",
  villas: "villa",
  villa: "villa",
  flats: "flat",
  flat: "flat",
  "farm-land": "farm-land",
  commercial: "commercial",
  projects: "project",
  project: "project",
  investment: "investment",
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return propertyCategories.map((c) => ({
    category: c.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const categoryId = slugToCategoryMap[slug];

  if (!categoryId) {
    notFound();
  }

  const categoryMeta = propertyCategories.find((c) => c.id === categoryId || c.slug === slug);
  const properties = initialProperties.filter((p) => p.category === categoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link & Category Header */}
      <div>
        <Link
          href="/properties"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-[#0B192C] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Categories</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                  Category Spotlight
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {properties.length} Active Listings
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                {categoryMeta?.name || slug} in Raipur & Chhattisgarh
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
                {categoryMeta?.description || "Explore verified real estate opportunities curated by Tulya Finance."}
              </p>
            </div>

            <Link
              href="/post-property"
              className="inline-flex items-center justify-center px-5 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
            >
              + Post in this Category
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Category Switcher */}
      <CategoryScroll activeCategory={slug} />

      {/* Category Property Grid */}
      <section>
        <PropertyGrid
          properties={properties}
          emptyMessage={`No active listings found currently under ${categoryMeta?.name || slug}. Post your property to be the first!`}
        />
      </section>
    </div>
  );
}
