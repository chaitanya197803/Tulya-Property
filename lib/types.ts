export type PropertyCategory =
  | "residential"
  | "plot"
  | "farm-land"
  | "commercial"
  | "villa"
  | "flat"
  | "project"
  | "investment";

export type PropertyPurpose = "buy" | "rent";

export type PropertyStatus =
  | "draft"
  | "published"
  | "featured"
  | "verified"
  | "sold"
  | "rented"
  | "inactive";

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category?: "security" | "convenience" | "infrastructure" | "leisure";
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  category: PropertyCategory;
  purpose: PropertyPurpose;
  price: number; // in INR
  pricePerSqFt?: number;
  area: number; // in Sq.Ft. or Acres
  areaUnit: "Sq.Ft." | "Acres" | "Gaj" | "Bigha";
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  video?: string;
  description: string;
  shortDescription: string;
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  furnishing?: "Unfurnished" | "Semi-Furnished" | "Fully Furnished";
  facing?: "North" | "South" | "East" | "West" | "North-East" | "North-West" | "South-East" | "South-West";
  possession?: "Ready to Move" | "Under Construction" | "Immediate" | "Within 6 Months";
  reraId?: string;
  propertyId: string;
  featured: boolean;
  verified: boolean;
  status: PropertyStatus;
  createdAt: string;
  updatedAt?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerType?: "Owner" | "Builder" | "Certified Agent";
}

export interface FilterState {
  searchQuery?: string;
  category?: PropertyCategory | "all";
  purpose?: PropertyPurpose | "all";
  city?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number | "all" | "4+";
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
}

export type SortOption =
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  propertyPrice: number;
  name: string;
  mobile: string;
  email: string;
  message: string;
  preferredVisitDate?: string;
  enquiryType: "General Enquiry" | "Site Visit Request" | "Price Negotiation";
  status: "New" | "Contacted" | "Visit Scheduled" | "Closed";
  createdAt: string;
}

export interface CategoryInfo {
  id: PropertyCategory;
  name: string;
  slug: string;
  icon: string;
  count: number;
  description: string;
  bgGradient?: string;
}

export interface LocalityInfo {
  name: string;
  city: string;
  propertyCount: number;
  avgPriceSqFt: string;
  image: string;
}
