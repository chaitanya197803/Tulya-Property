"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";
import { Enquiry } from "../../lib/types";
import { formatIndianCurrency, generateWhatsAppLink, generateTelLink, formatTimeAgo } from "../../lib/formatters";
import { updateEnquiryStatus } from "../../lib/storage";

interface EnquiriesTableProps {
  enquiries: Enquiry[];
  onRefresh?: () => void;
}

export default function EnquiriesTable({ enquiries, onRefresh }: EnquiriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mobile.includes(searchTerm) ||
      e.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (enquiryId: string, newStatus: Enquiry["status"]) => {
    updateEnquiryStatus(enquiryId, newStatus);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by customer name, phone, or property..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#0B192C]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Lead Statuses</option>
            <option value="New">New Leads</option>
            <option value="Contacted">Contacted</option>
            <option value="Visit Scheduled">Visit Scheduled</option>
            <option value="Closed">Closed / Converted</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Lead ID & Customer</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Property of Interest</th>
              <th className="py-3.5 px-4">Message / Site Visit</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Quick Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No customer enquiries found matching criteria.
                </td>
              </tr>
            ) : (
              filteredEnquiries.map((enq) => {
                const whatsappUrl = `https://wa.me/${enq.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${enq.name}, thank you for contacting Property Engine regarding ${enq.propertyTitle}. When is a good time to speak?`
                )}`;

                return (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer Name + Time */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0">
                          {enq.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{enq.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {enq.id} • {formatTimeAgo(enq.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone & Email */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800">{enq.mobile}</div>
                        <div className="text-[11px] text-slate-400">{enq.email}</div>
                      </div>
                    </td>

                    {/* Property Title */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/property/${enq.propertySlug}`}
                        className="font-bold text-slate-900 hover:text-[#C5A059] line-clamp-1 max-w-xs"
                      >
                        {enq.propertyTitle}
                      </Link>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                        Budget: {formatIndianCurrency(enq.propertyPrice)}
                      </span>
                    </td>

                    {/* Message & Visit Date */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-600 line-clamp-1">{enq.message}</p>
                      {enq.preferredVisitDate && (
                        <div className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                          <Calendar className="w-3 h-3 text-amber-700" />
                          <span>Visit: {new Date(enq.preferredVisitDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as Enquiry["status"])}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          enq.status === "New"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : enq.status === "Contacted"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : enq.status === "Visit Scheduled"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Visit Scheduled">Visit Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200"
                          title="WhatsApp Customer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${enq.mobile.replace(/\s+/g, "")}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
