"use client";

import { BarChart3, PieChart, TrendingUp, Users, Eye, Sparkles } from "lucide-react";

export default function AnalyticsCharts() {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  const listingsData = [12, 19, 24, 31, 42, 58];
  const enquiriesData = [35, 48, 62, 85, 114, 142];

  const categoryBreakdown = [
    { name: "Residential Plots", percentage: 35, color: "bg-[#0B192C]" },
    { name: "Flats & Penthouses", percentage: 28, color: "bg-[#C5A059]" },
    { name: "Villas & Bungalows", percentage: 18, color: "bg-blue-600" },
    { name: "Commercial & Retail", percentage: 12, color: "bg-emerald-600" },
    { name: "Farm Land & Estates", percentage: 7, color: "bg-amber-600" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Monthly Marketplace Growth */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Marketplace Listing & Lead Velocity</h3>
            <p className="text-xs text-slate-500">Monthly new properties vs buyer enquiries</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            +38% MoM Growth
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="h-48 pt-6 flex items-end justify-between gap-3 border-b border-slate-100 pb-2">
          {months.map((month, idx) => {
            const listingsHeight = (listingsData[idx] / 60) * 100;
            const enquiriesHeight = (enquiriesData[idx] / 150) * 100;

            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  {/* Listings Bar */}
                  <div
                    style={{ height: `${listingsHeight}%` }}
                    className="w-3 bg-[#0B192C] rounded-t group-hover:bg-[#1E3E62] transition-all relative"
                    title={`Listings: ${listingsData[idx]}`}
                  />
                  {/* Enquiries Bar */}
                  <div
                    style={{ height: `${enquiriesHeight}%` }}
                    className="w-3 bg-[#C5A059] rounded-t group-hover:bg-[#dfbe7d] transition-all relative"
                    title={`Enquiries: ${enquiriesData[idx]}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{month}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center space-x-6 text-xs font-semibold text-slate-600 pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#0B192C]"></span>
            <span>New Property Listings</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#C5A059]"></span>
            <span>Buyer Enquiries</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Inventory Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Inventory Category Share</h3>
            <p className="text-xs text-slate-500">Distribution across asset classes in Raipur Metro</p>
          </div>
          <span className="text-xs font-bold text-[#0B192C] bg-slate-100 px-2.5 py-1 rounded-full">
            Active Inventory
          </span>
        </div>

        {/* Horizontal Percentage Breakdown */}
        <div className="space-y-3 pt-2">
          {categoryBreakdown.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{item.name}</span>
                <span className="font-bold text-slate-900">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${item.percentage}%` }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Top Velocity: <strong>Residential Plots (Shankar Nagar & Sector 12)</strong></span>
        </div>
      </div>
    </div>
  );
}
