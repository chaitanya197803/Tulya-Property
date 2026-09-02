/**
 * Formats a number into Indian Rupee notation (e.g. ₹25 Lakh, ₹1.45 Cr, ₹35,000)
 */
export function formatIndianCurrency(amount: number, isRent: boolean = false): string {
  if (!amount || isNaN(amount)) return "Price on Request";

  if (isRent) {
    return `₹${amount.toLocaleString("en-IN")}/mo`;
  }

  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  } else if (amount >= 1000) {
    const k = amount / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Formats price per square foot
 */
export function formatPricePerSqFt(price: number, area: number): string {
  if (!price || !area || area <= 0) return "";
  const perSqFt = Math.round(price / area);
  return `₹${perSqFt.toLocaleString("en-IN")}/Sq.Ft.`;
}

/**
 * Formats area with proper unit
 */
export function formatArea(area: number, unit: string = "Sq.Ft."): string {
  return `${area.toLocaleString("en-IN")} ${unit}`;
}

/**
 * Calculates estimated monthly home loan EMI
 * Principal, Annual Interest Rate (default 8.5%), Tenure in Years (default 20)
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number = 8.5,
  tenureYears: number = 20
): {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
} {
  const p = principal * 0.8; // Assume 80% loan to value
  const r = annualInterestRate / 12 / 100;
  const n = tenureYears * 12;

  if (r === 0) {
    const emi = p / n;
    return { monthlyEMI: Math.round(emi), totalInterest: 0, totalPayment: Math.round(p) };
  }

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
}

/**
 * Generates WhatsApp prefilled link with property information
 */
export function generateWhatsAppLink(
  phone: string = "+919876543210",
  propertyTitle?: string,
  propertyId?: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  let message = "Hello Property Engine, I am interested in exploring property opportunities.";
  if (propertyTitle && propertyId) {
    message = `Hello Property Engine, I am interested in ${propertyTitle}. Property ID: ${propertyId}. Please share more details.`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates Tel call link
 */
export function generateTelLink(phone: string = "+919876543210"): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/**
 * Relative date formatter (e.g., "2 days ago")
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}
