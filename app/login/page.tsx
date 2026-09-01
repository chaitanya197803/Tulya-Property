"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"buyer" | "owner" | "admin">("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/properties");
      }
    }, 600);
  };

  const handleQuickAdminDemo = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#C5A059] flex items-center justify-center mx-auto shadow-md border border-[#C5A059]/40">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#0B192C]">Tulya Finance Portal</h1>
          <p className="text-xs text-slate-500">
            Log in to manage your saved properties, enquiries, and listings.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`py-2 rounded-lg transition-colors ${
              role === "buyer"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`py-2 rounded-lg transition-colors ${
              role === "owner"
                ? "bg-[#0B192C] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`py-2 rounded-lg transition-colors ${
              role === "admin"
                ? "bg-[#C5A059] text-[#0B192C] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Quick 1-Click Demo Admin Banner */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-amber-950 font-semibold">
            <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Prototype Demo Access:</span>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminDemo}
            className="px-3 py-1 bg-[#0B192C] text-[#C5A059] text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Open Admin Portal →
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Registered Email or Mobile
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                required
                defaultValue={role === "admin" ? "admin@tulyafinance.com" : "customer@tulyafinance.com"}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold uppercase text-slate-700">Password</label>
              <a href="#" className="text-slate-500 hover:underline font-semibold">
                Forgot?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                defaultValue="password123"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? "Signing in..." : role === "admin" ? "Login to Admin Portal" : "Sign In"}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Don't have an account?{" "}
          <Link href="/post-property" className="text-[#0B192C] font-bold hover:underline">
            Post a Property Free
          </Link>
        </div>
      </div>
    </div>
  );
}
