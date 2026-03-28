"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  type EventResponse,
  type CategoryGroupResponse,
  getEvent,
  getCategories,
} from "@/lib/api";
import EventPageClient from "./EventPageClient";

function buildCategoryNameMap(groups: CategoryGroupResponse[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const group of groups) {
    for (const cat of group.categories ?? []) {
      map[cat.id] = cat.name ?? "Другое";
    }
  }
  return map;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const days = [
    "Воскресенье", "Понедельник", "Вторник", "Среда",
    "Четверг", "Пятница", "Суббота",
  ];
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${dayName}, ${day} ${month} · ${hours}:${minutes}`;
}

function PriceBadge({ price }: { price: number | null }) {
  if (!price) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
        Бесплатно
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-bg-alt text-text">
      {price} BYN
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-secondary">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-secondary">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function EventDetailClient() {
  const params = useParams();
  const { token } = useAuth();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    Promise.all([
      getEvent(id, token ?? undefined),
      getCategories(),
    ])
      .then(([evt, groups]) => {
        setEvent(evt);
        setCategoryNames(buildCategoryNameMap(groups));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id, token]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <p className="text-text-secondary">Событие не найдено</p>
      </main>
    );
  }

  const categoryName = categoryNames[event.category] ?? "Другое";

  return (
    <main className="flex-1">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 md:py-14">
        {/* Event header */}
        <header className="mb-10">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-accent-light text-accent">
              {categoryName}
            </span>
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-4xl text-text mb-5 leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-text-secondary mb-4">
            <span className="inline-flex items-center gap-2">
              <CalendarIcon />
              {formatDate(event.startTime)}
            </span>
            {event.city && (
              <span className="inline-flex items-center gap-2">
                <PinIcon />
                {event.city}
              </span>
            )}
          </div>

          <p className="text-sm text-text-secondary mb-4">
            Организатор:{" "}
            <span className="font-semibold text-text">
              {event.creatorName ?? "Неизвестно"}
            </span>
          </p>

          <PriceBadge price={event.cost} />
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left column */}
          <div>
            {event.description && (
              <section className="mb-10">
                <h2 className="font-heading font-bold text-xl mb-4">
                  Описание
                </h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </section>
            )}
          </div>

          {/* Right column */}
          <EventPageClient
            currentPeople={event.currentParticipants}
            maxPeople={event.maxParticipants}
            participants={[]}
          />
        </div>
      </div>
    </main>
  );
}
