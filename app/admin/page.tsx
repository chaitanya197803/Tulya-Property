"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  PlusCircle,
  MessageSquareText,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  CalendarCheck,
  PhoneCall,
  Search,
  ExternalLink,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardCard from "../../components/admin/DashboardCard";
import PropertyTable from "../../components/admin/PropertyTable";
import EnquiriesTable from "../../components/admin/EnquiriesTable";
import AnalyticsCharts from "../../components/admin/AnalyticsCharts";
import { getAllProperties, getEnquiries } from "../../lib/storage";
import { Property, Enquiry } from "../../lib/types";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const loadData = () => {
    setProperties(getAllProperties());
    setEnquiries(getEnquiries());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("tulya:property-added", loadData);
    window.addEventListener("tulya:property-updated", loadData);
    window.addEventListener("tulya:enquiry-added", loadData);
    window.addEventListener("tulya:enquiry-updated", loadData);
    return () => {
      window.removeEventListener("tulya:property-added", loadData);
      window.removeEventListener("tulya:property-updated", loadData);
      window.removeEventListener("tulya:enquiry-added", loadData);
      window.removeEventListener("tulya:enquiry-updated", loadData);
    };
  }, []);

  const totalProperties = properties.length;
  const activeListings = properties.filter((p) => p.status === "published").length;
  const newEnquiries = enquiries.filter((e) => e.status === "New").length;
  const siteVisits = enquiries.filter((e) => e.status === "Visit Scheduled").length;
  const featuredCount = properties.filter((p) => p.featured).length;
  const verifiedCount = properties.filter((p) => p.verified).length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SaaS Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        enquiriesCount={newEnquiries}
      />

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                Enterprise Dashboard
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Environment
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1 capitalize">
              {currentTab === "dashboard"
                ? "Marketplace Overview"
                : currentTab.replace("-", " ")}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/post-property"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Add New Listing</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Marketplace</span>
            </Link>
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {currentTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <DashboardCard
                title="Total Properties"
                value={totalProperties}
                subtitle="All listed inventory"
                icon={Building}
                trend={{ value: "+18%", isPositive: true }}
              />
              <DashboardCard
                title="Active Listings"
                value={activeListings}
                subtitle="Published on portal"
                icon={TrendingUp}
                trend={{ value: "+12%", isPositive: true }}
                highlightColor="text-emerald-600"
              />
              <DashboardCard
                title="New Enquiries"
                value={newEnquiries}
                subtitle="Pending response"
                icon={MessageSquareText}
                trend={{ value: "+24%", isPositive: true }}
                highlightColor="text-rose-600"
              />
              <DashboardCard
                title="Site Visits"
                value={siteVisits}
                subtitle="Scheduled this week"
                icon={CalendarCheck}
                trend={{ value: "+8%", isPositive: true }}
                highlightColor="text-amber-600"
              />
              <DashboardCard
                title="Featured Listings"
                value={featuredCount}
                subtitle="Homepage spotlight"
                icon={Sparkles}
                highlightColor="text-[#C5A059]"
              />
              <DashboardCard
                title="Potential Leads"
                value={enquiries.length}
                subtitle="Total lead pipeline"
                icon={Users}
                highlightColor="text-blue-600"
              />
            </div>

            {/* Analytics Charts */}
            <AnalyticsCharts />

            {/* Recent Leads & Enquiries Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Recent Customer Leads</h3>
                <button
                  type="button"
                  onClick={() => setCurrentTab("enquiries")}
                  className="text-xs font-bold text-[#0B192C] hover:text-[#C5A059]"
                >
                  View All Enquiries ({enquiries.length}) →
                </button>
              </div>
              <EnquiriesTable enquiries={enquiries.slice(0, 5)} onRefresh={loadData} />
            </div>

            {/* Properties Inventory Overview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Active Inventory Management</h3>
                <button
                  type="button"
                  onClick={() => setCurrentTab("properties")}
                  className="text-xs font-bold text-[#0B192C] hover:text-[#C5A059]"
                >
                  Manage All Properties →
                </button>
              </div>
              <PropertyTable properties={properties.slice(0, 6)} onRefresh={loadData} />
            </div>
          </div>
        )}

        {/* TAB 2: ALL PROPERTIES */}
        {currentTab === "properties" && (
          <div className="space-y-4">
            <PropertyTable properties={properties} onRefresh={loadData} />
          </div>
        )}

        {/* TAB 3: ADD PROPERTY LINK */}
        {currentTab === "add-property" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#0B192C] text-[#C5A059] mx-auto flex items-center justify-center">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Create New Listing</h3>
            <p className="text-xs text-slate-500">
              Launch the property posting wizard to add high quality listings to the marketplace.
            </p>
            <Link
              href="/post-property"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-md"
            >
              <span>Launch Multi-Step Posting Wizard</span>
            </Link>
          </div>
        )}

        {/* TAB 4: ENQUIRIES & LEADS */}
        {currentTab === "enquiries" && (
          <div className="space-y-4">
            <EnquiriesTable enquiries={enquiries} onRefresh={loadData} />
          </div>
        )}

        {/* TAB 5: CUSTOMERS */}
        {currentTab === "customers" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">Registered Leads & Customer Contacts</h3>
              <div className="divide-y divide-slate-100 text-xs">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{enq.name}</span>
                      <span className="text-slate-500">{enq.mobile} • {enq.email}</span>
                    </div>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {enq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FEATURED PROPERTIES */}
        {currentTab === "featured" && (
          <div className="space-y-4">
            <PropertyTable
              properties={properties.filter((p) => p.featured)}
              onRefresh={loadData}
            />
          </div>
        )}

        {/* TAB 7: VERIFIED REGISTRY */}
        {currentTab === "verified" && (
          <div className="space-y-4">
            <PropertyTable
              properties={properties.filter((p) => p.verified)}
              onRefresh={loadData}
            />
          </div>
        )}

        {/* TAB 8: REPORTS */}
        {currentTab === "reports" && (
          <div className="space-y-6">
            <AnalyticsCharts />
          </div>
        )}

        {/* TAB 9: SETTINGS */}
        {currentTab === "settings" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl space-y-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900">Marketplace Configuration</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Maps API Key (Configured in Env)
                </label>
                <input
                  type="text"
                  readOnly
                  value="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Environment Managed)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Advisory Desk Phone
                </label>
                <input
                  type="text"
                  defaultValue="+91 98765 43210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Raipur Headquarters Address
                </label>
                <input
                  type="text"
                  defaultValue="4th Floor, Tulya Towers, VIP Road, Near Magneto Mall, Raipur, Chhattisgarh 492006"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
