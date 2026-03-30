"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { joinEvent, leaveEvent } from "@/lib/api";
import AuthModal from "@/components/AuthModal";

const AVATAR_COLORS = [
  { bg: "bg-accent-light", text: "text-accent" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-amber-100", text: "text-amber-700" },
];

interface Participant {
  id: string;
  name: string;
  is_organizer: boolean;
}

interface EventPageClientProps {
  eventId: string;
  creatorUserId: string;
  isJoinedByMe: boolean;
  currentPeople: number;
  maxPeople: number;
  participants: Participant[];
  onJoinChange?: () => void;
}

export default function EventPageClient({
  eventId,
  creatorUserId,
  isJoinedByMe: initialIsJoined,
  currentPeople: initialCurrentPeople,
  maxPeople,
  participants,
  onJoinChange,
}: EventPageClientProps) {
  const { user, token, isLoading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(initialIsJoined);
  const [currentPeople, setCurrentPeople] = useState(initialCurrentPeople);
  const [joining, setJoining] = useState(false);

  const isOwner = !!user && user.id === creatorUserId;

  const handleJoin = async () => {
    if (!token || !user) {
      setAuthOpen(true);
      return;
    }
    if (isOwner) return;

    setJoining(true);
    try {
      if (isJoined) {
        await leaveEvent(eventId, token);
        setIsJoined(false);
        setCurrentPeople((c) => Math.max(0, c - 1));
      } else {
        await joinEvent(eventId, token);
        setIsJoined(true);
        setCurrentPeople((c) => c + 1);
      }
      onJoinChange?.();
    } catch (err) {
      console.error("Join/leave failed:", err);
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progress = Math.round((currentPeople / maxPeople) * 100);

  return (
    <>
      {/* Sticky sidebar card */}
      <div className="border border-border rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
        {/* Spots */}
        <p className="font-heading font-semibold text-lg mb-3">
          {currentPeople} из {maxPeople} мест
        </p>
        <div className="h-1.5 rounded-full bg-bg-alt mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Participant list */}
        <ul className="space-y-3 mb-6">
          {participants.map((p, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const initial = p.name.charAt(0).toUpperCase();
            return (
              <li key={p.id} className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${color.bg} ${color.text}`}
                >
                  {initial}
                </span>
                <span className="text-sm font-medium text-text">{p.name}</span>
                {p.is_organizer && (
                  <span className="text-xs text-text-secondary bg-bg-alt px-2 py-0.5 rounded-full">
                    организатор
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* Join / Leave / Owner button */}
        {isOwner ? (
          <div className="w-full bg-bg-alt text-text-secondary rounded-xl py-4 font-semibold text-base text-center">
            Ваше событие
          </div>
        ) : isJoined ? (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl py-4 font-semibold text-base transition-all cursor-pointer disabled:opacity-50"
          >
            {joining ? "..." : "Выйти"}
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl py-4 font-semibold text-base transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
          >
            {joining ? "..." : "Иду →"}
          </button>
        )}
        {!token && !isLoading && (
          <p className="text-xs text-text-secondary text-center mt-2.5">
            Нужен аккаунт &middot; вход через Telegram
          </p>
        )}

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-medium text-text hover:bg-bg-alt transition-colors cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {copied ? "Скопировано!" : "Поделиться"}
        </button>
      </div>

      {/* Bottom banner — only show for unauthenticated users */}
      {!token && !isLoading && (
        <section className="col-span-full mt-16 -mx-6 md:-mx-12 px-6 md:px-12 py-12 bg-accent-light rounded-none">
          <div className="max-w-[1200px] mx-auto text-center">
            <h3 className="font-heading font-bold text-2xl mb-2">
              Хочешь присоединиться?
            </h3>
            <p className="text-text-secondary mb-6">
              Создай аккаунт за 10 секунд
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleJoin}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-colors cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.99-3.44 3.81-1.6 4.6-1.87 5.12-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z" />
                </svg>
                Войти через Telegram
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-semibold text-text hover:bg-white transition-colors cursor-pointer"
              >
                Скачать приложение
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Auth modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
