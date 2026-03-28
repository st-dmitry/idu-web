"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Navbar({
  variant = "landing",
}: {
  variant?: "landing" | "app";
}) {
  const { user, token, logout } = useAuth();
  const isLoggedIn = !!user && !!token;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="font-heading font-black text-[22px] tracking-tight text-text no-underline">
          idu<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {variant === "landing" && !isLoggedIn ? (
            <>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium text-text border border-border hover:bg-bg-alt transition-colors no-underline"
              >
                Войти
              </Link>
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all hover:scale-[1.02] no-underline"
              >
                Попробовать бесплатно
              </Link>
            </>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/feed"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-bg-alt transition-colors no-underline"
              >
                Лента
              </Link>
              <Link
                href="/my-events"
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-text hover:bg-bg-alt transition-colors no-underline"
              >
                Мои события
              </Link>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all hover:scale-[1.02] no-underline"
              >
                <svg
                  width="14"
                  height="14"
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
                <span className="hidden sm:inline">Создать</span>
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:bg-bg-alt transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium text-text border border-border hover:bg-bg-alt transition-colors no-underline"
              >
                Войти
              </Link>
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all hover:scale-[1.02] no-underline"
              >
                Скачать приложение
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
