"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  Navigation,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap");
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Deep links for Google Maps navigation & Street View
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  const getTileUrl = (type: "roadmap" | "satellite" | "terrain") => {
    switch (type) {
      case "satellite":
        return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      case "terrain":
        return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
      case "roadmap":
      default:
        return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: currentZoom,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        scrollWheelZoom: interactive,
      });

      const tileLayer = L.tileLayer(getTileUrl(mapType), {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Custom Tulya Pin Icon
      const pinHtml = `
        <div style="transform: translate(-50%, -100%); position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="background: #0B192C; color: #ffffff; padding: 6px 12px; border-radius: 12px; font-weight: 800; font-size: 11px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); border: 2px solid #C5A059; display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span style="color: #C5A059;">📍</span>
            <span>${propertyTitle || "Property Location"}</span>
          </div>
          <div style="width: 10px; height: 10px; background: #0B192C; transform: rotate(45deg); margin-top: -5px; border-right: 2px solid #C5A059; border-bottom: 2px solid #C5A059;"></div>
          <div style="width: 14px; height: 6px; background: rgba(0,0,0,0.2); border-radius: 9999px; margin-top: 2px;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-property-single-pin",
        iconSize: [120, 40],
        iconAnchor: [60, 40],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div style="padding: 10px; font-family: inherit;">
          <strong style="color: #0B192C; font-size: 13px; display: block; margin-bottom: 4px;">${propertyTitle || "Tulya Verified Property"}</strong>
          <p style="margin: 0 0 8px; font-size: 11px; color: #475569;">${address || ""}</p>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #0B192C; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
            Get Directions ↗
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, propertyTitle, address, interactive]);

  // Update tile layer on mapType switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    async function updateLayer() {
      const L = (await import("leaflet")).default;
      if (tileLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
        const newLayer = L.tileLayer(getTileUrl(mapType), {
          maxZoom: 20,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }).addTo(mapInstanceRef.current);
        tileLayerRef.current = newLayer;
      }
    }

    updateLayer();
  }, [mapType]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.parentElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
      {/* Real Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{ height }}
        className="w-full bg-slate-100 z-0"
      />

      {/* Top Left: Coordinates HUD & Verified Badge */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col space-y-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-[#0B192C]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Maps Verified Coordinates</span>
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

      {/* Top Right: Layer Switcher (Map / Satellite / Terrain) */}
      <div className="absolute top-3.5 right-3.5 z-10 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 flex items-center space-x-1 text-xs">
        <button
          type="button"
          onClick={() => setMapType("roadmap")}
          className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
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
          className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
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
          className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
            mapType === "terrain"
              ? "bg-[#0B192C] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Terrain
        </button>
      </div>

      {/* Bottom Right: Zoom & Fullscreen Controls */}
      {interactive && (
        <div className="absolute bottom-16 right-3.5 z-10 flex flex-col space-y-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-slate-200" />
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Bar: Action buttons */}
      <div className="bg-white px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 z-10 relative">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Interactive Google Map & Satellite View</span>
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
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            title="Open Street View 360"
          >
            <span>Street View</span>
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
