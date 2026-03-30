"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventResponse } from "@/lib/api";

interface EventsMapProps {
  events: EventResponse[];
  categoryNames: Record<number, string>;
  userLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173]; // Moscow
const DEFAULT_ZOOM = 12;

export default function EventsMap({
  events,
  categoryNames,
  userLocation,
}: EventsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center: [number, number] = userLocation
      ? [userLocation.lat, userLocation.lng]
      : DEFAULT_CENTER;

    const map = L.map(containerRef.current).setView(center, DEFAULT_ZOOM);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center when user location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.setView([userLocation.lat, userLocation.lng], DEFAULT_ZOOM);
  }, [userLocation]);

  // Update markers when events change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#4285F4;border:3px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("Вы здесь");
    }

    // Add event markers
    for (const event of events) {
      if (!event.latitude || !event.longitude) continue;

      const markerIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#FF4D1C;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:600;">${event.currentParticipants}</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const date = new Date(event.startTime);
      const formatted = date.toLocaleDateString("ru-RU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

      const price =
        event.cost === null || event.cost === 0
          ? "бесплатно"
          : `${event.cost} BYN`;

      const popup = `
        <div style="min-width:180px;font-family:sans-serif;">
          <div style="font-size:11px;color:#FF4D1C;font-weight:500;margin-bottom:2px;">${categoryNames[event.category] ?? "Другое"}</div>
          <div style="font-weight:600;font-size:14px;margin-bottom:4px;">${event.title ?? ""}</div>
          <div style="font-size:12px;color:#6B7280;margin-bottom:6px;">${formatted} &middot; ${event.currentParticipants}/${event.maxParticipants} чел. &middot; ${price}</div>
          <a href="/event/${event.id}" style="display:block;text-align:center;background:#FF4D1C;color:white;padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500;">Подробнее</a>
        </div>
      `;

      L.marker([event.latitude, event.longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(popup);
    }

    // Fit bounds if events exist and no user location
    if (events.length > 0 && !userLocation) {
      const validEvents = events.filter((e) => e.latitude && e.longitude);
      if (validEvents.length > 0) {
        const bounds = L.latLngBounds(
          validEvents.map((e) => [e.latitude, e.longitude] as [number, number])
        );
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [events, categoryNames, userLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl border border-border overflow-hidden"
      style={{ height: "calc(100vh - 320px)", minHeight: 400 }}
    />
  );
}
