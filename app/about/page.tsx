import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#C5A059] border border-[#C5A059]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Tulya Finance Properties</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] tracking-tight">
          Pioneering Transparent Real Estate in Central India
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Tulya Finance Properties brings fintech transparency, rigorous title verification, and
          e-commerce speed to property discovery across Raipur, Naya Raipur, Bhilai, and Durg.
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">100% Title Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every plot, villa, and high-rise flat on our platform undergoes verification with RERA,
            Town & Country Planning (TNCP), and local municipal revenue records.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Property-First Marketplace</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No endless marketing fluff. We give buyers instant access to pricing, exact geocoded
            coordinates, floor plans, and direct contact with verified owners and builders.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Fintech Advisory</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct integration with Tulya Home Loans provides real-time interest rate discovery,
            eligibility evaluation, and fast-track loan disbursals.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/30 shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#C5A059]">₹120+ Cr</div>
            <div className="text-xs text-slate-300 font-semibold mt-1">Property Value Managed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#C5A059]">150+</div>
            <div className="text-xs text-slate-300 font-semibold mt-1">Verified Listings</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#C5A059]">1,400+</div>
            <div className="text-xs text-slate-300 font-semibold mt-1">Happy Families Guided</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#C5A059]">15 Mins</div>
            <div className="text-xs text-slate-300 font-semibold mt-1">Average Response Time</div>
          </div>
        </div>
      </div>

      {/* Office & CTA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Visit Our Corporate Headquarters</h3>
          <p className="text-xs text-slate-500">
            4th Floor, Tulya Towers, VIP Road, Near Magneto Mall, Raipur, Chhattisgarh 492006
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <span>Contact Advisory Desk</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </Link>
      </div>
    </div>
  );
}
