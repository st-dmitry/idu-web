"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth";
import EventCard from "@/components/EventCard";
import {
  type EventResponse,
  type CategoryGroupResponse,
  getEvents,
  getCategories,
} from "@/lib/api";

const EventsMap = dynamic(() => import("@/components/EventsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-2xl border border-border flex items-center justify-center" style={{ height: "calc(100vh - 320px)", minHeight: 400 }}>
      <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

type ViewMode = "list" | "map";

function buildCategoryNameMap(groups: CategoryGroupResponse[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const group of groups) {
    for (const cat of group.categories ?? []) {
      map[cat.id] = cat.name ?? "Другое";
    }
  }
  return map;
}

interface FlatCategory {
  id: number;
  name: string;
}

function flattenCategories(groups: CategoryGroupResponse[]): FlatCategory[] {
  const result: FlatCategory[] = [];
  for (const group of groups) {
    for (const cat of group.categories ?? []) {
      result.push({ id: cat.id, name: cat.name ?? "Другое" });
    }
  }
  return result;
}

export default function FeedClient() {
  const { token } = useAuth();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupResponse[]>([]);
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyMode, setNearbyMode] = useState(false);

  useEffect(() => {
    Promise.all([
      getEvents(undefined, token ?? undefined),
      getCategories(),
    ])
      .then(([evts, groups]) => {
        setEvents(evts);
        setCategoryGroups(groups);
        setCategoryNames(buildCategoryNameMap(groups));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const requestLocation = useCallback(() => {
    if (userLocation) {
      // Toggle off nearby mode
      setNearbyMode((prev) => !prev);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearbyMode(true);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [userLocation]);

  // Refetch with location filter when nearby mode activates
  useEffect(() => {
    if (!nearbyMode || !userLocation) return;
    setLoading(true);
    getEvents(
      { latitude: userLocation.lat, longitude: userLocation.lng, radiusKm: 25 },
      token ?? undefined
    )
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [nearbyMode, userLocation, token]);

  // Refetch without location filter when nearby mode deactivates
  useEffect(() => {
    if (nearbyMode) return;
    if (userLocation === null) return; // initial state, skip
    setLoading(true);
    getEvents(undefined, token ?? undefined)
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearbyMode, token]);

  const allCategories = flattenCategories(categoryGroups);

  const filtered = events.filter((e) => {
    const matchCategory =
      activeCategory === "all" || e.category === activeCategory;
    const matchSearch =
      !search ||
      (e.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (e.city ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className="flex-1">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text mb-2">
              События рядом
            </h1>
            <p className="text-text-secondary text-sm">
              {events.length} событий
            </p>
          </div>

          {/* View toggle + location */}
          <div className="flex items-center gap-2">
            {/* Nearby filter button */}
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                nearbyMode
                  ? "bg-accent text-white shadow-sm"
                  : "bg-white text-text border border-border hover:bg-bg-alt"
              }`}
              title="Показать рядом"
            >
              {locationLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              )}
              <span className="hidden sm:inline">Рядом</span>
            </button>

            {/* List/Map toggle */}
            <div className="flex bg-white border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-accent text-white"
                    : "text-text hover:bg-bg-alt"
                }`}
                title="Список"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-accent text-white"
                    : "text-text hover:bg-bg-alt"
                }`}
                title="Карта"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Поиск по названию или месту..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === "all"
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-text border border-border hover:bg-bg-alt"
            }`}
          >
            Все
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-accent text-white shadow-sm"
                  : "bg-white text-text border border-border hover:bg-bg-alt"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content: List or Map */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewMode === "map" ? (
          <EventsMap
            events={filtered}
            categoryNames={categoryNames}
            userLocation={userLocation}
          />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title ?? ""}
                categoryName={categoryNames[event.category] ?? "Другое"}
                dateTime={event.startTime}
                location={event.city ?? ""}
                currentPeople={event.currentParticipants}
                maxPeople={event.maxParticipants}
                price={event.cost ?? 0}
                isJoined={event.isJoinedByMe}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">😔</p>
            <p className="text-text-secondary text-sm">
              Ничего не найдено. Попробуй другую категорию или поисковый запрос.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
