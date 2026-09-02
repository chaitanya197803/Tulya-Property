"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  MessageSquareText,
  Users,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Settings,
  ArrowLeft,
} from "lucide-react";

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  enquiriesCount?: number;
}

export default function AdminSidebar({
  currentTab,
  onSelectTab,
  enquiriesCount = 0,
}: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "properties", label: "Properties", icon: Building },
    { id: "add-property", label: "Add Property", icon: PlusCircle, highlight: true },
    { id: "enquiries", label: "Enquiries & Leads", icon: MessageSquareText, badge: enquiriesCount },
    { id: "customers", label: "Customers", icon: Users },
    { id: "featured", label: "Featured Properties", icon: Sparkles },
    { id: "verified", label: "Verified Registry", icon: ShieldCheck },
    { id: "reports", label: "Analytics & Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B192C] text-slate-300 min-h-screen p-5 flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="pb-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 rounded-lg bg-white flex items-center justify-center p-0.5 border border-[#C5A059]/40 overflow-hidden shrink-0">
              <Image
                src="/logo.png"
                alt="Property Engine"
                width={36}
                height={36}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-white text-sm tracking-tight">ENGINE</span>
                <span className="font-light text-[#C5A059] text-sm tracking-tight">ADMIN</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block -mt-0.5">
                Property Engine Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#C5A059] text-[#0B192C] font-bold shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0B192C]" : "text-[#C5A059]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-[#0B192C] text-white" : "bg-[#C5A059] text-[#0B192C]"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Return to Live Site */}
      <div className="pt-6 border-t border-slate-800 space-y-3">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Marketplace</span>
        </Link>
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          Logged in as <strong className="text-white">Admin Desk (Raipur HQ)</strong>
        </div>
      </div>
    </aside>
  );
}
