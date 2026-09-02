import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileNav from "../components/layout/MobileNav";

export const metadata: Metadata = {
  title: {
    default: "Property Engine — Real Estate Marketplace | Raipur & Chhattisgarh",
    template: "%s | Property Engine",
  },
  description:
    "Explore verified residential plots, luxury villas, modern flats, commercial spaces, and farm land in Raipur, Naya Raipur, Bhilai, and Durg with Property Engine.",
  keywords: [
    "Property Engine",
    "Raipur real estate",
    "Naya Raipur plots",
    "flats in Raipur",
    "villas in Raipur",
    "commercial property Raipur",
    "property marketplace Chhattisgarh",
  ],
  authors: [{ name: "Property Engine" }],
  openGraph: {
    title: "Property Engine — Central India's Premier Property Marketplace",
    description:
      "Discover verified plots, villas, flats, and commercial properties across Raipur and Chhattisgarh.",
    url: "https://propertyengine.in",
    siteName: "Property Engine",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-slate-50 text-slate-900 light">
      <head>
        <meta name="theme-color" content="#0B192C" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-[#C5A059]/30 selection:text-[#0B192C]">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
