"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Sparkles,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Building,
  MoreVertical,
} from "lucide-react";
import { Property, PropertyStatus } from "../../lib/types";
import { formatIndianCurrency, formatArea } from "../../lib/formatters";
import { updatePropertyStatus } from "../../lib/storage";

interface PropertyTableProps {
  properties: Property[];
  onRefresh?: () => void;
}

export default function PropertyTable({ properties, onRefresh }: PropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleFeatured = (property: Property) => {
    updatePropertyStatus(property.id, { featured: !property.featured });
    if (onRefresh) onRefresh();
  };

  const handleToggleVerified = (property: Property) => {
    updatePropertyStatus(property.id, { verified: !property.verified });
    if (onRefresh) onRefresh();
  };

  const handleChangeStatus = (property: Property, status: PropertyStatus) => {
    updatePropertyStatus(property.id, { status });
    if (onRefresh) onRefresh();
  };

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case "published":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Published</span>;
      case "draft":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Draft</span>;
      case "sold":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Sold Out</span>;
      case "rented":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Rented</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">Inactive</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Title, ID, City or Locality..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#0B192C]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="plot">Plots</option>
            <option value="residential">Residential</option>
            <option value="flat">Flats</option>
            <option value="villa">Villas</option>
            <option value="farm-land">Farm Land</option>
            <option value="commercial">Commercial</option>
            <option value="project">Projects</option>
          </select>

          <Link
            href="/post-property"
            className="px-4 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            + Add Listing
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Property</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Badges</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No properties match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredProperties.map((p) => {
                const isRent = p.purpose === "rent";
                const img = p.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=200&q=80";

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title + Thumbnail + ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <Image src={img} alt={p.title} fill className="object-cover" />
                        </div>
                        <div>
                          <Link
                            href={`/property/${p.slug}`}
                            className="font-bold text-slate-900 hover:text-[#C5A059] line-clamp-1 max-w-xs"
                          >
                            {p.title}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                            ID: {p.propertyId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 capitalize text-slate-700">
                      {p.category.replace("-", " ")}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-900 block">{p.locality}</span>
                      <span className="text-[11px] text-slate-400">{p.city}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900">
                        {formatIndianCurrency(p.price, isRent)}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatArea(p.area, p.areaUnit)}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleChangeStatus(p, e.target.value as PropertyStatus)}
                        className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    {/* Badges Toggle */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleVerified(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.verified
                              ? "bg-emerald-100 text-emerald-700 shadow-2xs"
                              : "bg-slate-100 text-slate-400 hover:text-emerald-600"
                          }`}
                          title={p.verified ? "Verified Property (Click to remove)" : "Mark as Verified"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            p.featured
                              ? "bg-amber-100 text-amber-700 shadow-2xs"
                              : "bg-slate-100 text-slate-400 hover:text-amber-600"
                          }`}
                          title={p.featured ? "Featured on Homepage (Click to remove)" : "Mark as Featured"}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/property/${p.slug}`}
                          className="p-1.5 text-slate-500 hover:text-[#0B192C] hover:bg-slate-100 rounded-lg"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>Showing <strong>{filteredProperties.length}</strong> listings</span>
        <span>Tulya Finance Real-Time Inventory Control</span>
      </div>
    </div>
  );
}
