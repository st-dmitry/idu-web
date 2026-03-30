"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  city: string;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    city: string;
  }) => void;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const DEFAULT_CENTER: [number, number] = [53.9006, 27.5590]; // Minsk
const DEFAULT_ZOOM = 12;

export default function LocationPicker({
  latitude,
  longitude,
  city,
  onLocationChange,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [query, setQuery] = useState(city);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateMarker = useCallback(
    (lat: number, lng: number) => {
      const map = mapRef.current;
      if (!map) return;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const icon = L.divIcon({
          html: `<div style="width:24px;height:24px;background:#FF4D1C;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      }

      map.setView([lat, lng], Math.max(map.getZoom(), 14));
    },
    []
  );

  // Reverse geocode: get city name from coordinates
  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=ru`,
          { headers: { "User-Agent": "idu-app" } }
        );
        const data = await res.json();
        const addr = data.address;
        const cityName =
          addr?.city || addr?.town || addr?.village || addr?.state || "";
        return cityName as string;
      } catch {
        return "";
      }
    },
    []
  );

  // Init map
  useEffect(() => {
    if (!showMap || !containerRef.current || mapRef.current) return;

    const center: [number, number] =
      latitude && longitude ? [latitude, longitude] : DEFAULT_CENTER;

    const map = L.map(containerRef.current).setView(center, DEFAULT_ZOOM);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Place initial marker if coords exist
    if (latitude && longitude) {
      updateMarker(latitude, longitude);
    }

    // Click to pick location
    map.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      updateMarker(lat, lng);
      const cityName = await reverseGeocode(lat, lng);
      setQuery(cityName);
      onLocationChange({ latitude: lat, longitude: lng, city: cityName });
    });

    // Fix map rendering in hidden containers
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap]);

  // Search with debounce
  function handleQueryChange(value: string) {
    setQuery(value);
    setShowResults(true);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&limit=5&accept-language=ru`,
          { headers: { "User-Agent": "idu-app" } }
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function selectResult(result: NominatimResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    // Extract short name (first part before comma)
    const shortName = result.display_name.split(",")[0].trim();
    setQuery(result.display_name.split(",").slice(0, 2).join(",").trim());
    setResults([]);
    setShowResults(false);

    onLocationChange({ latitude: lat, longitude: lng, city: shortName });

    if (mapRef.current) {
      updateMarker(lat, lng);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Место</label>

      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Поиск места или адреса..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>

        {/* Search results dropdown */}
        {showResults && (results.length > 0 || searching) && (
          <div className="absolute z-[10000] top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
            {searching && (
              <div className="px-4 py-3 text-sm text-text-secondary">
                Поиск...
              </div>
            )}
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectResult(r)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-bg-alt transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-start gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent mt-0.5 shrink-0"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="line-clamp-2">{r.display_name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toggle map button */}
      <button
        type="button"
        onClick={() => setShowMap(!showMap)}
        className="mt-2 flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {showMap ? "Скрыть карту" : "Выбрать на карте"}
      </button>

      {/* Map */}
      {showMap && (
        <div
          ref={containerRef}
          className="mt-2 w-full rounded-xl border border-border overflow-hidden"
          style={{ height: 280 }}
        />
      )}

      {/* Selected location display */}
      {latitude && longitude && (
        <div className="mt-2 text-xs text-text-secondary">
          Координаты: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>
      )}
    </div>
  );
}
