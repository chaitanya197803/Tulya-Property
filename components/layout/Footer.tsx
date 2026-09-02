import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { generateWhatsAppLink, generateTelLink } from "../../lib/formatters";

export default function Footer() {
  const whatsappUrl = generateWhatsAppLink("+919876543210");
  const telUrl = generateTelLink("+919876543210");

  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-[#081225]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Verified Titles</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  RERA & TNCP vetted documents for stress-free ownership.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Direct Marketplace</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Connect directly with owners, builders and verified agents.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Financing & Advisory</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant home loan eligibility & registry guidance under one roof.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white border border-[#C5A059]">
                <Building2 className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    TULYA
                  </span>
                  <span className="text-2xl font-light tracking-tight text-[#C5A059]">
                    FINANCE
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-wider font-medium text-slate-400">
                  Discover Properties. Connect with Opportunities.
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Tulya Finance Properties is Central India's premier digital real-estate marketplace.
              Browse verified residential plots, luxury villas, modern flats, commercial spaces, and
              agricultural acreage across Raipur, Atal Nagar, Bhilai, and Durg.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href={telUrl}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>+91 98765 43210</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold rounded-lg border border-[#25D366]/40 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Col 2: Property Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/properties/plots" className="hover:text-white transition-colors">
                  Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/properties/villas" className="hover:text-white transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link href="/properties/flats" className="hover:text-white transition-colors">
                  Flats & Penthouses
                </Link>
              </li>
              <li>
                <Link href="/properties/farm-land" className="hover:text-white transition-colors">
                  Farm Land & Estates
                </Link>
              </li>
              <li>
                <Link href="/properties/commercial" className="hover:text-white transition-colors">
                  Commercial & Shops
                </Link>
              </li>
              <li>
                <Link href="/properties/projects" className="hover:text-white transition-colors">
                  Upcoming Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Localities */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
              Top Locations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/properties?city=Raipur"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Raipur</span>
                  <span className="text-xs text-slate-500">120+ Listings</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?city=Naya+Raipur"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Naya Raipur</span>
                  <span className="text-xs text-slate-500">45+ Plots</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?city=Bhilai"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Bhilai</span>
                  <span className="text-xs text-slate-500">30+ Homes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?city=Durg"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Durg</span>
                  <span className="text-xs text-slate-500">22+ Properties</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-[#C5A059] hover:underline text-xs font-semibold flex items-center space-x-1 pt-1"
                >
                  <span>Explore Map Discovery</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A059] pl-2.5">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Tulya Finance
                </Link>
              </li>
              <li>
                <Link href="/post-property" className="hover:text-white transition-colors">
                  Post Free Property
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors">
                  Saved Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer & Agent Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#C5A059] hover:underline font-medium">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Raipur HQ Address Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span>
              <strong>Corporate Office:</strong> Ground Floor, Station Road, City Center
              Mall, Durg, Chhattisgarh 492006
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>
              <strong>Email Support:</strong> properties@tulyafinance.com / info@tulyafinance.com
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>
              <strong>Customer Care:</strong> +91 98765 43210 (Mon - Sat, 9:30 AM - 7:30 PM)
            </span>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Tulya Finance Properties Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              RERA Compliance
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-200 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
