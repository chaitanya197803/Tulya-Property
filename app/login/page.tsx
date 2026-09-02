"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"buyer" | "owner" | "admin">("buyer");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        // Sign Up with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: role,
              phone: phone.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        // If session is active immediately (e.g. email confirmation turned off), update/upsert profile directly as well
        if (data?.session && data.user && phone.trim()) {
          await supabase
            .from("profiles")
            .update({ phone: phone.trim() })
            .eq("id", data.user.id);
        }

        // Check if email confirmation is required or session already active
        if (data?.user && !data.session) {
          setSuccessMessage(
            "Account created successfully! Please check your email inbox to verify your account."
          );
          setLoading(false);
          return;
        }

        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          if (role === "admin") {
            router.push("/admin");
          } else {
            router.push("/properties");
          }
        }, 1000);
      } else {
        // Sign In with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        // Fetch user profile to check actual role
        let userRole = role;
        if (data?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          if (profile?.role) {
            userRole = profile.role as "buyer" | "owner" | "admin";
          }
        }

        setSuccessMessage("Logged in successfully! Redirecting...");
        setTimeout(() => {
          if (userRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/properties");
          }
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminDemo = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md border border-[#C5A059]/40 p-1 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Property Engine"
              width={64}
              height={64}
              priority
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-black text-[#0B192C]">
            {mode === "signin" ? "Welcome to Property Engine" : "Create Property Engine Account"}
          </h1>
          <p className="text-xs text-slate-500">
            {mode === "signin"
              ? "Sign in to manage your saved properties, enquiries, and listings."
              : "Register to explore verified properties and post free listings."}
          </p>
        </div>

        {/* Auth Mode Toggle (Sign In vs Sign Up) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "signin"
                ? "bg-white text-[#0B192C] shadow-sm font-black"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "signup"
                ? "bg-white text-[#0B192C] shadow-sm font-black"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Switcher */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase text-slate-500">
            {mode === "signup" ? "I am registering as:" : "Account Type:"}
          </label>
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

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-xs text-rose-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "signup" && (
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold uppercase text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              {mode === "signin" && (
                <a href="#" className="text-slate-500 hover:underline font-semibold">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (Min. 6 chars)"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                <span>{mode === "signup" ? "Creating Account..." : "Signing in..."}</span>
              </>
            ) : (
              <>
                <span>
                  {mode === "signup"
                    ? "Create Account & Save Profile"
                    : role === "admin"
                    ? "Login to Admin Portal"
                    : "Sign In"}
                </span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 flex flex-col space-y-1">
          <div>
            {mode === "signin" ? "Don't have an account? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="text-[#0B192C] font-bold hover:underline"
            >
              {mode === "signin" ? "Sign up now" : "Sign in to existing account"}
            </button>
          </div>
          <div className="pt-1">
            <Link href="/post-property" className="text-[#C5A059] font-bold hover:underline">
              Want to list a property? Post a Property Free →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
