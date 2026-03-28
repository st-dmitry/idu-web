"use client";

import { useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { loginWithTelegram } = useAuth();
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl p-10 max-w-[400px] w-full relative shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bg-alt hover:bg-border flex items-center justify-center text-text-secondary text-lg transition-colors"
        >
          &times;
        </button>

        <h3 className="font-heading font-bold text-xl mb-2 pr-8">
          Присоединяйся!
        </h3>
        <p className="text-sm text-text-secondary mb-7 leading-relaxed">
          Чтобы присоединиться к событию, войди через Telegram или Apple
        </p>

        <div className="flex flex-col gap-2.5 mb-5">
          <button
            onClick={() => { loginWithTelegram(); onClose(); }}
            className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.99-3.44 3.81-1.6 4.6-1.87 5.12-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z" />
            </svg>
            Войти через Telegram
          </button>

          <button className="w-full py-3.5 bg-text hover:bg-[#333] text-white rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Войти через Apple
          </button>
        </div>

        <p className="text-center text-xs text-text-secondary">
          Уже есть аккаунт?{" "}
          <a href="/auth" className="text-accent font-medium hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}
