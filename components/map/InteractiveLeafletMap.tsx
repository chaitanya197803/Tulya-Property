"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Property } from "../../lib/types";
import { formatIndianCurrency } from "../../lib/formatters";
import {
  Locate,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface InteractiveLeafletMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  selectedCity?: string;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function InteractiveLeafletMap({
  properties,
  selectedProperty,
  onSelectProperty,
  selectedCity = "all",
  className = "w-full h-full",
  initialCenter = [21.2400, 81.6500],
  initialZoom = 13,
}: InteractiveLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerGroupRef = useRef<any>(null);
  const markersMapRef = useRef<Map<string, any>>(new Map());

  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap");
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const [centerCoords, setCenterCoords] = useState<[number, number]>(initialCenter);
  const [isLocating, setIsLocating] = useState(false);

  // Tile layer configurations for Google Maps and Satellite
  const getTileUrl = (type: "roadmap" | "satellite" | "terrain") => {
    switch (type) {
      case "satellite":
        // Google Hybrid (Satellite + Roads + Labels)
        return "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
      case "terrain":
        // Google Terrain
        return "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}";
      case "roadmap":
      default:
        // Google Roadmap (Clean roads, city names, landmarks)
        return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    }
  };

  // Helper to format short price tag for map pins
  const formatShortPrice = (price: number, isRent?: boolean) => {
    if (isRent) {
      if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L/m`;
      return `₹${(price / 1000).toFixed(0)}k/m`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  // Initialize Map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Add base Google Maps tile layer
      const tileLayer = L.tileLayer(getTileUrl("roadmap"), {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Create Layer Group for property markers
      const markersLayerGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markersLayerGroup;

      mapInstanceRef.current = map;

      // Listen for map move/zoom events
      map.on("move", () => {
        const center = map.getCenter();
        setCenterCoords([center.lat, center.lng]);
      });

      map.on("zoomend", () => {
        setCurrentZoom(map.getZoom());
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    async function updateTile() {
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

    updateTile();
  }, [mapType]);

  // Update Markers when properties or selectedProperty changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    async function renderMarkers() {
      const L = (await import("leaflet")).default;
      const group = markersLayerGroupRef.current;
      group.clearLayers();
      markersMapRef.current.clear();

      properties.forEach((property) => {
        if (!property.latitude || !property.longitude) return;

        const isSelected = selectedProperty?.id === property.id;
        const isRent = property.purpose === "rent";
        const shortPrice = formatShortPrice(property.price, isRent);
        const mainImage = property.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80";

        // Custom HTML Marker Icon
        const markerHtml = `
          <div class="custom-property-pin cursor-pointer transition-all duration-200" style="transform: translate(-50%, -50%);">
            <div class="flex items-center space-x-1 px-2.5 py-1 rounded-full shadow-lg font-bold text-xs transition-transform transform hover:scale-110 ${
              isSelected
                ? "bg-[#0B192C] text-[#C5A059] ring-4 ring-[#C5A059]/60 scale-115 border-2 border-[#C5A059] z-50"
                : "bg-[#0B192C] text-white border border-[#C5A059]/70 hover:bg-[#C5A059] hover:text-[#0B192C] z-10"
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#C5A059] animate-ping" : "bg-[#C5A059]"}"></span>
              <span>${shortPrice}</span>
            </div>
            ${
              isSelected
                ? `<div class="w-2 h-2 bg-[#0B192C] rotate-45 mx-auto -mt-1 border-r border-b border-[#C5A059]"></div>`
                : ""
            }
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "custom-map-marker",
          iconSize: [80, 32],
          iconAnchor: [40, 16],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([property.latitude, property.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : 0,
        });

        // Popup Content
        const popupContent = `
          <div style="font-family: inherit; width: 280px; overflow: hidden; background: #ffffff;">
            <div style="position: relative; width: 100%; height: 140px; background: #0b192c;">
              <img src="${mainImage}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 8px; left: 8px; display: flex; gap: 4px;">
                <span style="background: ${property.purpose === "rent" ? "#0284c7" : "#0B192C"}; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase;">
                  ${property.category}
                </span>
                ${
                  property.verified
                    ? `<span style="background: #059669; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">✓ Verified</span>`
                    : ""
                }
              </div>
            </div>
            <div style="padding: 12px;">
              <div style="font-size: 15px; font-weight: 900; color: #0B192C; margin-bottom: 2px;">
                ${formatIndianCurrency(property.price, isRent)}
              </div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; line-height: 1.3; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                ${property.title}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 10px; display: flex; align-items: center; gap: 4px;">
                <span>📍 ${property.locality}, ${property.city}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <a href="/property/${property.slug}" style="flex: 1; text-align: center; background: #0B192C; color: #ffffff; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-block;">
                  View Property
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}" target="_blank" rel="noopener noreferrer" style="background: #f1f5f9; color: #0f172a; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 2px;" title="Get Directions">
                  Directions ↗
                </a>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          minWidth: 280,
          className: "custom-leaflet-popup",
        });

        marker.on("click", () => {
          onSelectProperty(property);
        });

        marker.addTo(group);
        markersMapRef.current.set(property.id, marker);
      });
    }

    renderMarkers();
  }, [properties, selectedProperty]);

  // Pan to selected property
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProperty) return;

    const lat = selectedProperty.latitude;
    const lng = selectedProperty.longitude;

    if (lat && lng) {
      mapInstanceRef.current.flyTo([lat, lng], 15, {
        duration: 1.2,
      });

      const marker = markersMapRef.current.get(selectedProperty.id);
      if (marker) {
        setTimeout(() => {
          if (!marker.isPopupOpen()) {
            marker.openPopup();
          }
        }, 600);
      }
    }
  }, [selectedProperty]);

  // Pan & Fit bounds when selectedCity changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const cityCenters: Record<string, { center: [number, number]; zoom: number }> = {
      Raipur: { center: [21.2514, 81.6296], zoom: 13 },
      "Naya Raipur": { center: [21.1624, 81.7850], zoom: 13 },
      Bhilai: { center: [21.2185, 81.3850], zoom: 13 },
      Durg: { center: [21.1895, 81.2820], zoom: 13 },
    };

    if (selectedCity && selectedCity !== "all" && cityCenters[selectedCity]) {
      const target = cityCenters[selectedCity];
      mapInstanceRef.current.flyTo(target.center, target.zoom, {
        duration: 1.5,
      });
    } else if (properties.length > 0) {
      // Fit all properties
      const validCoords = properties
        .filter((p) => p.latitude && p.longitude)
        .map((p) => [p.latitude, p.longitude] as [number, number]);

      if (validCoords.length > 0) {
        import("leaflet").then(({ default: L }) => {
          if (mapInstanceRef.current) {
            const bounds = L.latLngBounds(validCoords);
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
          }
        });
      }
    }
  }, [selectedCity]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
      },
      () => {
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.parentElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className={`relative ${className} bg-slate-100 overflow-hidden`}>
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Coordinates HUD & Google Maps Brand Indicator */}
      <div className="absolute top-3 left-3 z-10 hidden sm:flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-bold text-[#0B192C]">Google Maps Live View</span>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] font-mono text-slate-500">
          {centerCoords[0].toFixed(4)}°N, {centerCoords[1].toFixed(4)}°E (z{currentZoom})
        </span>
      </div>

      {/* Top Right: Layer Switcher (Google Map / Satellite / Terrain) */}
      <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 flex items-center space-x-1 text-xs">
        <button
          type="button"
          onClick={() => setMapType("roadmap")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            mapType === "roadmap"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => setMapType("satellite")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            mapType === "satellite"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapType("terrain")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            mapType === "terrain"
              ? "bg-[#0B192C] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Terrain
        </button>
      </div>

      {/* Bottom Right: Zoom & Location Controls */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col space-y-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200">
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
          onClick={handleLocateMe}
          className={`p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer ${
            isLocating ? "animate-spin text-[#C5A059]" : ""
          }`}
          title="Locate My Position"
        >
          <Locate className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Google Maps Direct Link */}
      <div className="absolute bottom-2 left-3 z-10">
        <a
          href={`https://www.google.com/maps/@${centerCoords[0]},${centerCoords[1]},${currentZoom}z`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-500 font-bold bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs hover:text-slate-800"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
