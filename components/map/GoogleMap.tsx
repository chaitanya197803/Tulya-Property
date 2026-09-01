"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  propertyTitle?: string;
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

export default function GoogleMap({
  latitude,
  longitude,
  address,
  propertyTitle,
  zoom = 15,
  height = "420px",
  interactive = true,
}: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap");
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Deep link to Google Maps directions
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  // If live Google Maps API key is configured, load dynamic map
  useEffect(() => {
    if (!apiKey) return;

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const initMap = () => {
      if (window.google && window.google.maps && mapContainerRef.current) {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: currentZoom,
          mapTypeId: mapType,
          disableDefaultUI: !interactive,
          zoomControl: interactive,
          fullscreenControl: interactive,
        });

        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: propertyTitle || "Property Location",
          animation: window.google.maps.Animation.DROP,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 6px; font-family: sans-serif;">
            <strong style="color: #0B192C; font-size: 13px;">${propertyTitle || "Tulya Verified Property"}</strong>
            <p style="margin: 4px 0 0; font-size: 11px; color: #475569;">${address || ""}</p>
          </div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        setIsApiKeyLoaded(true);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      script.onload = initMap;
    }
  }, [apiKey, latitude, longitude, currentZoom, mapType, interactive, propertyTitle, address]);

  // Handle zoom in/out in fallback mode
  const handleZoomIn = () => setCurrentZoom((prev) => Math.min(prev + 1, 20));
  const handleZoomOut = () => setCurrentZoom((prev) => Math.max(prev - 1, 10));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
      {/* If Google Maps API is loaded with valid Key */}
      {apiKey && isApiKeyLoaded ? (
        <div ref={mapContainerRef} style={{ height }} className="w-full" />
      ) : (
        /* Rich Interactive Fallback Map with Visual Tiles, Pin Beacon, Coordinates HUD & Layer Switcher */
        <div
          style={{ height }}
          className={`relative w-full overflow-hidden transition-all duration-300 ${
            mapType === "satellite"
              ? "bg-[#0b1b16]"
              : mapType === "terrain"
              ? "bg-[#e8ece9]"
              : "bg-[#e5e9f0]"
          }`}
        >
          {/* Subtle Grid / Street Vector Background Pattern */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                mapType === "satellite"
                  ? "radial-gradient(circle at 50% 50%, rgba(20, 83, 45, 0.4) 0%, rgba(2, 6, 23, 0.9) 100%)"
                  : "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Road Vector lines simulation */}
          <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="16" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="10" />
            <line x1="30%" y1="0" x2="70%" y2="100%" stroke="#cbd5e1" strokeWidth="12" />
            <circle cx="50%" cy="50%" r="90" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,6" />
          </svg>

          {/* Center Pin & Pulsing Radar Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto z-10">
            {/* Animated Radar Pulse */}
            <div className="absolute -bottom-1 w-12 h-6 bg-[#C5A059]/30 rounded-full animate-ping" />
            <div className="absolute -bottom-1 w-8 h-4 bg-[#0B192C]/20 rounded-full" />

            {/* Custom Tulya Pin Badge */}
            <div className="relative flex flex-col items-center -translate-y-6">
              <div className="bg-[#0B192C] text-white px-3 py-1.5 rounded-xl shadow-xl border-2 border-[#C5A059] flex items-center space-x-1.5 whitespace-nowrap animate-bounce">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span className="text-xs font-bold">{propertyTitle || "Exact Location"}</span>
              </div>
              <div className="w-3 h-3 bg-[#0B192C] rotate-45 -mt-1.5 border-r-2 border-b-2 border-[#C5A059]" />
            </div>
          </div>

          {/* Top Left: Coordinates HUD & Verified Badge */}
          <div className="absolute top-3.5 left-3.5 z-20 flex flex-col space-y-2">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#0B192C]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geocoded Property Coordinates</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                {latitude.toFixed(6)}° N, {longitude.toFixed(6)}° E
              </div>
              {address && (
                <div className="text-[11px] text-slate-600 max-w-xs truncate mt-1">
                  📍 {address}
                </div>
              )}
            </div>
          </div>

          {/* Top Right: Layer Switcher (Roadmap / Satellite / Terrain) */}
          <div className="absolute top-3.5 right-3.5 z-20 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 flex items-center space-x-1 text-xs">
            <button
              type="button"
              onClick={() => setMapType("roadmap")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                mapType === "roadmap"
                  ? "bg-[#0B192C] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapType("satellite")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                mapType === "satellite"
                  ? "bg-[#0B192C] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType("terrain")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                mapType === "terrain"
                  ? "bg-[#0B192C] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Bottom Right: Zoom Controls */}
          {interactive && (
            <div className="absolute bottom-16 right-3.5 z-20 flex flex-col space-y-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bottom Bar: "Get Directions" Action Button & Google Maps Deep Link */}
      <div className="bg-white px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 z-20 relative">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <Compass className="w-4 h-4 text-[#C5A059]" />
          <span>Interactive Location & Satellite View</span>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Get Directions</span>
          </a>

          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs transition-colors"
            title="Open in Google Maps App"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    google: any;
  }
}
