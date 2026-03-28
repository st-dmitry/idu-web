"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { user, isNewUser, loginWithTelegram, devLogin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && isNewUser) {
      router.replace("/onboarding");
    } else if (user) {
      router.replace("/feed");
    }
  }, [user, isNewUser, router]);

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-border">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/"
            className="font-heading font-black text-[22px] tracking-tight text-text no-underline"
          >
            idu<span className="text-accent">.</span>
          </Link>
        </div>
      </nav>

      {/* Auth card */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-border p-10 md:p-14 max-w-[440px] w-full">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-heading font-black text-3xl tracking-tight mb-3">
              idu<span className="text-accent">.</span>
            </h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Войди, чтобы находить компанию
              <br />
              на любые активности
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={loginWithTelegram}
              className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.65-2.89 7.99-3.44 3.81-1.6 4.6-1.87 5.12-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .38z" />
              </svg>
              Войти через Telegram
            </button>

            <button className="w-full py-4 bg-text hover:bg-[#333] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Войти через Apple
            </button>

            {devLogin && (
              <button
                onClick={devLogin}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-colors"
              >
                Dev: Skip Auth
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              или
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              {
                icon: "🎯",
                title: "Находи людей рядом",
                desc: "События по интересам в твоём городе",
              },
              {
                icon: "💬",
                title: "Чат через Telegram",
                desc: "Никаких лишних аккаунтов",
              },
              {
                icon: "⭐",
                title: "Рейтинг и доверие",
                desc: "Оценивай и получай оценки после встреч",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm text-text">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-text-secondary/60 mt-8 leading-relaxed">
            Нажимая кнопку входа, ты соглашаешься
            <br />с{" "}
            <a href="#" className="underline hover:text-text-secondary">
              условиями использования
            </a>{" "}
            и{" "}
            <a href="#" className="underline hover:text-text-secondary">
              политикой конфиденциальности
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
