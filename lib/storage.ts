import { Property, Enquiry } from "./types";
import { initialProperties } from "../data/properties";

const SAVED_KEY = "tulya_saved_properties";
const CUSTOM_PROPERTIES_KEY = "tulya_custom_properties";
const ENQUIRIES_KEY = "tulya_enquiries";

// Default seed enquiries
const seedEnquiries: Enquiry[] = [
  {
    id: "ENQ-1001",
    propertyId: "TF-RES-001",
    propertyTitle: "Luxury 3 BHK Penthouse in Shankar Nagar",
    propertySlug: "luxury-3-bhk-penthouse-shankar-nagar-raipur",
    propertyPrice: 13500000,
    name: "Rameshwar Patel",
    mobile: "+91 98271 88231",
    email: "rameshwar.patel@gmail.com",
    message: "Interested in the terrace garden and want to inspect carpet area this weekend.",
    preferredVisitDate: "2026-09-06",
    enquiryType: "Site Visit Request",
    status: "New",
    createdAt: "2026-08-30T10:15:00Z",
  },
  {
    id: "ENQ-1002",
    propertyId: "TF-PLT-001",
    propertyTitle: "Prime Commercial Plot on VIP Road",
    propertySlug: "prime-commercial-plot-vip-road-raipur",
    propertyPrice: 42000000,
    name: "Dr. Alok Agrawal",
    mobile: "+91 94252 09144",
    email: "dr.agrawal@agrawalclinics.com",
    message: "Is commercial sanction approved for diagnostic center? Please share RERA docs.",
    preferredVisitDate: "2026-09-04",
    enquiryType: "General Enquiry",
    status: "Contacted",
    createdAt: "2026-08-29T14:30:00Z",
  },
  {
    id: "ENQ-1003",
    propertyId: "TF-VIL-001",
    propertyTitle: "Grand 4 BHK Royal Villa in Kamal Vihar",
    propertySlug: "grand-4-bhk-royal-villa-kamal-vihar-raipur",
    propertyPrice: 24500000,
    name: "Sunita Verma",
    mobile: "+91 97555 12890",
    email: "sunitav@outlook.com",
    message: "Looking for immediate possession and home loan assistance through Property Engine.",
    preferredVisitDate: "2026-09-05",
    enquiryType: "Price Negotiation",
    status: "Visit Scheduled",
    createdAt: "2026-08-28T09:00:00Z",
  },
];

export function getSavedPropertyIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : ["TF-PLT-001", "TF-RES-001"]; // initial friendly defaults
  } catch {
    return [];
  }
}

export function isPropertySaved(id: string): boolean {
  return getSavedPropertyIds().includes(id);
}

export function toggleSaveProperty(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const ids = getSavedPropertyIds();
    let updated: string[];
    let isSavedNow: boolean;

    if (ids.includes(id)) {
      updated = ids.filter((item) => item !== id);
      isSavedNow = false;
    } else {
      updated = [id, ...ids];
      isSavedNow = true;
    }

    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tulya:saved-changed", { detail: { id, isSaved: isSavedNow, count: updated.length } }));
    return isSavedNow;
  } catch {
    return false;
  }
}

export function getAllProperties(): Property[] {
  if (typeof window === "undefined") return initialProperties;
  try {
    const rawCustom = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    const customProps: Property[] = rawCustom ? JSON.parse(rawCustom) : [];
    // Deduplicate: custom properties override initial ones with the same ID
    const customIds = new Set(customProps.map((p) => p.id));
    const deduped = initialProperties.filter((p) => !customIds.has(p.id));
    return [...customProps, ...deduped];
  } catch {
    return initialProperties;
  }
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const all = getAllProperties();
  return all.find((p) => p.slug === slug || p.id.toLowerCase() === slug.toLowerCase());
}

export function saveNewProperty(property: Property): void {
  if (typeof window === "undefined") return;
  try {
    const rawCustom = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    const customProps: Property[] = rawCustom ? JSON.parse(rawCustom) : [];
    customProps.unshift(property);
    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(customProps));
    window.dispatchEvent(new CustomEvent("tulya:property-added", { detail: property }));
  } catch (err) {
    console.error("Error saving property:", err);
  }
}

export function updatePropertyStatus(id: string, updates: Partial<Property>): void {
  if (typeof window === "undefined") return;
  try {
    const rawCustom = localStorage.getItem(CUSTOM_PROPERTIES_KEY);
    let customProps: Property[] = rawCustom ? JSON.parse(rawCustom) : [];
    const index = customProps.findIndex((p) => p.id === id);

    if (index >= 0) {
      customProps[index] = { ...customProps[index], ...updates };
    } else {
      const existing = initialProperties.find((p) => p.id === id);
      if (existing) {
        customProps.push({ ...existing, ...updates });
      }
    }

    localStorage.setItem(CUSTOM_PROPERTIES_KEY, JSON.stringify(customProps));
    window.dispatchEvent(new CustomEvent("tulya:property-updated", { detail: { id, updates } }));
  } catch (err) {
    console.error("Error updating property:", err);
  }
}

export function getEnquiries(): Enquiry[] {
  if (typeof window === "undefined") return seedEnquiries;
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    return raw ? JSON.parse(raw) : seedEnquiries;
  } catch {
    return seedEnquiries;
  }
}

export function addEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt" | "status">): Enquiry {
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = getEnquiries();
      const updated = [newEnquiry, ...current];
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tulya:enquiry-added", { detail: newEnquiry }));
    } catch (err) {
      console.error("Error saving enquiry:", err);
    }
  }

  return newEnquiry;
}

export function updateEnquiryStatus(enquiryId: string, status: Enquiry["status"]): void {
  if (typeof window === "undefined") return;
  try {
    const current = getEnquiries();
    const updated = current.map((e) => (e.id === enquiryId ? { ...e, status } : e));
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tulya:enquiry-updated", { detail: { enquiryId, status } }));
  } catch (err) {
    console.error("Error updating enquiry:", err);
  }
}
