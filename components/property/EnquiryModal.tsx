"use client";

import { useState } from "react";
import { X, CheckCircle2, Send, Calendar, User, Phone, Mail, MessageSquare } from "lucide-react";
import { Property } from "../../lib/types";
import { addEnquiry } from "../../lib/storage";

interface EnquiryModalProps {
  property: Property;
  initialType?: "General Enquiry" | "Site Visit Request" | "Price Negotiation";
  onClose: () => void;
}

export default function EnquiryModal({
  property,
  initialType = "General Enquiry",
  onClose,
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    initialType === "Site Visit Request"
      ? "I would like to schedule an in-person site visit to inspect this property."
      : `I am interested in ${property.title}. Please provide more details regarding pricing, site plan, and loan eligibility.`
  );
  const [preferredDate, setPreferredDate] = useState("");
  const [enquiryType, setEnquiryType] = useState(initialType);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) return;

    addEnquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertySlug: property.slug,
      propertyPrice: property.price,
      name,
      mobile,
      email: email || "customer@propertyengine.in",
      message,
      preferredVisitDate: preferredDate || undefined,
      enquiryType,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#C5A059]">
              Property Engine Advisory
            </span>
            <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
              {property.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Enquiry Received!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you. Our Property Engine team will contact you shortly on your registered number
                to coordinate details.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                Reference Property: <strong>{property.propertyId}</strong>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Enquiry Type Selector */}
              <div className="grid grid-cols-2 gap-2 pb-2">
                <button
                  type="button"
                  onClick={() => setEnquiryType("Site Visit Request")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    enquiryType === "Site Visit Request"
                      ? "bg-[#0B192C] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Schedule Site Visit
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryType("General Enquiry")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    enquiryType === "General Enquiry"
                      ? "bg-[#0B192C] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  General Enquiry
                </button>
              </div>

              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Preferred Visit Date
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Special Notes / Queries
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Submit Enquiry</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Your contact details are encrypted and shared only with certified Property Engine advisors.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
