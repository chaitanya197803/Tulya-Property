"use client";

import { useState } from "react";
import {
  Phone,
  MessageSquare,
  Mail,
  CalendarCheck,
  ShieldCheck,
  Clock,
  UserCheck,
} from "lucide-react";
import { Property } from "../../lib/types";
import { generateWhatsAppLink, generateTelLink } from "../../lib/formatters";
import EnquiryModal from "./EnquiryModal";

interface ContactCardProps {
  property: Property;
}

export default function ContactCard({ property }: ContactCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"General Enquiry" | "Site Visit Request">("General Enquiry");

  const phone = property.ownerPhone || "+919876543210";
  const whatsappUrl = generateWhatsAppLink(phone, property.title, property.propertyId);
  const telUrl = generateTelLink(phone);

  const openEnquiry = () => {
    setModalType("General Enquiry");
    setModalOpen(true);
  };

  const openSiteVisit = () => {
    setModalType("Site Visit Request");
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5 sticky top-24">
        {/* Agent / Desk Header */}
        <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-[#0B192C] text-[#C5A059] flex items-center justify-center font-black text-lg border-2 border-[#C5A059] shadow-sm">
            TF
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-slate-900 text-sm">
                {property.ownerName || "Tulya Finance Property Desk"}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {property.ownerType || "Certified Real Estate Advisor"}
            </span>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Responds within <strong>15 minutes</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Dedicated Site Visit Executive in Raipur</span>
          </div>
        </div>

        {/* Primary Contact Action Buttons */}
        <div className="space-y-2.5">
          {/* Call Now */}
          <a
            href={telUrl}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            <Phone className="w-4 h-4 text-[#C5A059]" />
            <span>Call Now: +91 98765 43210</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Schedule Site Visit */}
          <button
            type="button"
            onClick={openSiteVisit}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-sm rounded-xl transition-all"
          >
            <CalendarCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Schedule Free Site Visit</span>
          </button>

          {/* Send Written Enquiry */}
          <button
            type="button"
            onClick={openEnquiry}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-all"
          >
            <Mail className="w-3.5 h-3.5 text-slate-600" />
            <span>Send Written Enquiry</span>
          </button>
        </div>

        {/* Guarantee Footer */}
        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-100">
          🔒 Zero brokerage on direct builder listings. Free home loan legal verification.
        </div>
      </div>

      {/* Enquiry Modal */}
      {modalOpen && (
        <EnquiryModal
          property={property}
          initialType={modalType}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
