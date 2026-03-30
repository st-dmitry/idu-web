"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  EventResponse,
  type CategoryGroupResponse,
  getMyCreatedEvents,
  getMyJoinedEvents,
  getCategories,
} from "@/lib/api";

const GROUP_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: "bg-emerald-100", text: "text-emerald-700" },
  1: { bg: "bg-purple-100", text: "text-purple-700" },
  2: { bg: "bg-orange-100", text: "text-orange-700" },
  3: { bg: "bg-indigo-100", text: "text-indigo-700" },
  4: { bg: "bg-blue-100", text: "text-blue-700" },
  5: { bg: "bg-violet-100", text: "text-violet-700" },
  6: { bg: "bg-rose-100", text: "text-rose-700" },
  7: { bg: "bg-amber-100", text: "text-amber-700" },
  8: { bg: "bg-teal-100", text: "text-teal-700" },
  9: { bg: "bg-fuchsia-100", text: "text-fuchsia-700" },
};

const DEFAULT_COLOR = { bg: "bg-gray-100", text: "text-gray-700" };

function buildCategoryLookup(groups: CategoryGroupResponse[]) {
  const labels: Record<number, string> = {};
  const colors: Record<number, { bg: string; text: string }> = {};
  for (const group of groups) {
    const groupColor = GROUP_COLORS[group.id] ?? DEFAULT_COLOR;
    for (const cat of group.categories ?? []) {
      labels[cat.id] = cat.name ?? "Другое";
      colors[cat.id] = groupColor;
    }
  }
  return { labels, colors };
}

type Tab = "created" | "joined";

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventRow({ event, categoryLabels, categoryColors }: {
  event: EventResponse;
  categoryLabels: Record<number, string>;
  categoryColors: Record<number, { bg: string; text: string }>;
}) {
  const colors = categoryColors[event.category] ?? DEFAULT_COLOR;
  const label = categoryLabels[event.category] ?? "Другое";
  const isPast = new Date(event.startTime) < new Date();

  return (
    <Link
      href={`/event/${event.id}`}
      className={`block bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 no-underline ${isPast ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {label}
        </span>
        {isPast && (
          <span className="text-xs text-text-secondary bg-bg-alt px-2 py-0.5 rounded-full">
            Прошло
          </span>
        )}
      </div>

      <h3 className="font-medium text-text text-base mb-1">
        {event.title}
      </h3>

      <p className="text-sm text-text-secondary">
        {formatDate(event.startTime)}
        {event.city && <> &middot; {event.city}</>}
        {" "}&middot; {event.currentParticipants}/{event.maxParticipants} чел.
        {event.cost === 0 || event.cost === null
          ? " · бесплатно"
          : ` · ${event.cost} BYN`}
      </p>
    </Link>
  );
}

export default function MyEventsClient() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("created");
  const [created, setCreated] = useState<EventResponse[]>([]);
  const [joined, setJoined] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLabels, setCategoryLabels] = useState<Record<number, string>>({});
  const [categoryColors, setCategoryColors] = useState<Record<number, { bg: string; text: string }>>({});

  useEffect(() => {
    getCategories()
      .then((groups) => {
        const lookup = buildCategoryLookup(groups);
        setCategoryLabels(lookup.labels);
        setCategoryColors(lookup.colors);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      getMyCreatedEvents(token),
      getMyJoinedEvents(token),
    ])
      .then(([c, j]) => {
        setCreated(c);
        setJoined(j);
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user || !token) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="font-heading font-bold text-xl mb-2">Войди, чтобы увидеть свои события</h2>
          <p className="text-text-secondary text-sm mb-6">
            Авторизуйся для доступа к своим событиям
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-colors"
          >
            Войти
          </button>
        </div>
      </main>
    );
  }

  const events = tab === "created" ? created : joined;

  return (
    <main className="flex-1">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text mb-1">
              Мои события
            </h1>
            <p className="text-text-secondary text-sm">
              {created.length} создано &middot; {joined.length} участий
            </p>
          </div>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all hover:scale-[1.02] no-underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Создать
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("created")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "created"
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-text border border-border hover:bg-bg-alt"
            }`}
          >
            Созданные
          </button>
          <button
            onClick={() => setTab("joined")}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === "joined"
                ? "bg-accent text-white shadow-sm"
                : "bg-white text-text border border-border hover:bg-bg-alt"
            }`}
          >
            Участвую
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-3">
            {events.map((event) => (
              <EventRow key={event.id} event={event} categoryLabels={categoryLabels} categoryColors={categoryColors} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">
              {tab === "created" ? "📝" : "🎯"}
            </p>
            <p className="text-text-secondary text-sm mb-4">
              {tab === "created"
                ? "Ты ещё не создал ни одного события"
                : "Ты ещё не присоединился ни к одному событию"}
            </p>
            <Link
              href={tab === "created" ? "/create-event" : "/feed"}
              className="inline-flex px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-medium transition-colors text-sm no-underline"
            >
              {tab === "created" ? "Создать первое" : "Найти события"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
