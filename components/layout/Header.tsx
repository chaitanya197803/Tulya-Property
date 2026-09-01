"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Heart,
  PlusCircle,
  User,
  Menu,
  X,
  MapPin,
  Search,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";
import { getSavedPropertyIds } from "../../lib/storage";

export default function Header() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initial saved count
    setSavedCount(getSavedPropertyIds().length);

    // Listen for real-time saved properties updates
    const handleSavedChange = () => {
      setSavedCount(getSavedPropertyIds().length);
    };

    window.addEventListener("tulya:saved-changed", handleSavedChange);
    return () => {
      window.removeEventListener("tulya:saved-changed", handleSavedChange);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Buy", href: "/properties?purpose=buy" },
    { name: "Rent", href: "/properties?purpose=rent" },
    { name: "Plots", href: "/properties/plots" },
    { name: "Land", href: "/properties/farm-land" },
    { name: "Commercial", href: "/properties/commercial" },
    { name: "Projects", href: "/properties/projects" },
  ];

  return (
    <>
      {/* Top micro-bar */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>100% RERA & TNCP Verified Property Listings</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Raipur • Naya Raipur • Bhilai • Durg</span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-1 hover:text-[#C5A059] transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#C5A059]" />
              <span>Advisory Helpline: +91 98765 43210</span>
            </a>
            <span className="text-slate-500">|</span>
            <Link
              href="/admin"
              className="text-[#C5A059] hover:underline font-medium flex items-center space-x-1"
            >
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#0B192C] flex items-center justify-center text-white shadow-md border border-[#C5A059]/40 group-hover:border-[#C5A059] transition-all">
                <Building2 className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-[#0B192C]">
                    TULYA
                  </span>
                  <span className="text-xl font-light tracking-tight text-[#C5A059]">
                    FINANCE
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                  Property Marketplace
                </span>
              </div>
            </Link>

            {/* Center Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#0B192C] bg-slate-100 font-semibold"
                        : "text-slate-700 hover:text-[#0B192C] hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Map Discovery Shortcut */}
              <Link
                href="/map"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0B192C] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                title="Explore Properties on Map"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Map View</span>
              </Link>

              {/* Saved Properties Heart */}
              <Link
                href="/saved"
                className="relative p-2.5 text-slate-700 hover:text-[#0B192C] hover:bg-slate-100 rounded-lg transition-colors"
                title="Shortlisted Properties"
              >
                <Heart className="w-5 h-5 text-slate-600 hover:text-rose-500" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A059] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in">
                    {savedCount}
                  </span>
                )}
              </Link>

              {/* Login Button */}
              <Link
                href="/login"
                className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-[#0B192C] hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Login</span>
              </Link>

              {/* Post Property CTA */}
              <Link
                href="/post-property"
                className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#0B192C] hover:bg-[#1E3E62] rounded-lg shadow-sm transition-all border border-[#0B192C] hover:shadow"
              >
                <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                <span>Post Property</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-[#C5A059] text-[#0B192C] px-1.5 py-0.5 rounded ml-1">
                  Free
                </span>
              </Link>

              {/* Mobile menu hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-[#0B192C] hover:bg-slate-100 rounded-lg focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <Link
                href="/map"
                className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-50 rounded-lg text-sm font-medium text-[#0B192C] border border-slate-200"
              >
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Map Search</span>
              </Link>
              <Link
                href="/properties"
                className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-50 rounded-lg text-sm font-medium text-[#0B192C] border border-slate-200"
              >
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>All Listings</span>
              </Link>
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-[#0B192C]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
              <Link
                href="/admin"
                className="w-full text-center py-2 text-xs font-semibold text-[#C5A059] bg-[#0B192C] rounded-lg"
              >
                Admin SaaS Portal
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
