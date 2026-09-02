"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import GoogleMap from "../../components/map/GoogleMap";
import { generateWhatsAppLink, generateTelLink } from "../../lib/formatters";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = generateWhatsAppLink("+919876543210");
  const telUrl = generateTelLink("+919876543210");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
          Get in Touch
        </span>
        <h1 className="text-3xl font-black text-[#0B192C]">
          Contact Property Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about a property, legal title verification, or home loan eligibility? Reach out to our dedicated Raipur advisory team.
        </p>
      </div>

      {/* Main 2-Col Grid: Contact Information Left, Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Office Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 space-y-6 shadow-lg border border-[#C5A059]/30">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Corporate Headquarters
            </h3>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">Raipur Office:</strong>
                  4th Floor, Property Engine Towers, VIP Road, Near Magneto The Mall, Raipur, Chhattisgarh 492006
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Helpline:</strong>
                  +91 98765 43210 / +91 771 409988
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Email Inquiries:</strong>
                  properties@propertyengine.in / info@propertyengine.in
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="text-white block text-sm">Advisory Hours:</strong>
                  Monday – Saturday: 9:30 AM – 7:30 PM (IST)
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
              <a
                href={telUrl}
                className="flex-1 text-center py-3 bg-[#C5A059] hover:bg-[#b38b42] text-[#0B192C] font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Call Hotline
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl transition-colors"
              >
                WhatsApp Desk
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for contacting Property Engine. One of our senior property advisors in Raipur will reach out to you within 30 minutes.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#0B192C] text-white text-xs font-bold rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Send an Advisory Enquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alok Agrawal"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98271 00000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Message / Property Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you are looking for (Location, Budget, Property Type)..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#0B192C]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>Submit Message to Raipur Desk</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* HQ Interactive Map Location */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Property Engine HQ Location</h3>
            <p className="text-xs text-slate-500">VIP Road, Near Magneto Mall, Raipur, Chhattisgarh</p>
          </div>
        </div>

        <GoogleMap
          latitude={21.2185}
          longitude={81.6912}
          address="Property Engine Towers, VIP Road, Raipur, Chhattisgarh 492006"
          propertyTitle="Property Engine Corporate Headquarters"
          zoom={16}
          height="340px"
        />
      </div>
    </div>
  );
}
