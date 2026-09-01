"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  verified?: boolean;
  featured?: boolean;
  videoUrl?: string;
}

export default function PropertyGallery({
  images,
  title,
  verified,
  featured,
  videoUrl,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fallbackImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % fallbackImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + fallbackImages.length) % fallbackImages.length);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* Main Image Stage */}
      <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
        <Image
          src={fallbackImages[activeIndex]}
          alt={`${title} - Photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover cursor-pointer group-hover:scale-102 transition-transform duration-500"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Top Badges & Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-2">
            {verified && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Property</span>
              </span>
            )}
            {featured && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-md text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Share Property"
            >
              <Share2 className="w-4 h-4 text-slate-700" />
              {copied && <span className="text-[11px] text-emerald-600 font-bold">Link Copied!</span>}
            </button>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-md transition-all"
              title="View Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {fallbackImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Video Tour Trigger Overlay */}
        <button
          type="button"
          onClick={() => setVideoModalOpen(true)}
          className="absolute bottom-4 right-4 flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#0B192C]/90 hover:bg-[#0B192C] text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all"
        >
          <div className="w-5 h-5 rounded-full bg-[#C5A059] flex items-center justify-center text-slate-950">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
          <span>Watch 4K Video Tour</span>
        </button>

        {/* Photo Counter */}
        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md">
          {activeIndex + 1} / {fallbackImages.length} Photos
        </div>
      </div>

      {/* Thumbnails Row */}
      {fallbackImages.length > 1 && (
        <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
          {fallbackImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-[#C5A059] ring-2 ring-[#C5A059]/30 scale-105 shadow-sm"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full h-[80vh]">
            <Image
              src={fallbackImages[activeIndex]}
              alt={`${title} fullscreen`}
              fill
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Video Tour Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-slate-800 relative">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">4K Virtual Video Walkthrough</h3>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center text-slate-950 shadow-xl mb-4 animate-pulse">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <h4 className="text-white font-bold text-base mb-1">{title}</h4>
              <p className="text-xs text-slate-400 max-w-md">
                High-definition drone footage & 360° interior walkthrough tour is ready.
                Contact our Raipur desk for live video inspection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
