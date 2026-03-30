"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthTab = "user" | "business";

export default function AuthPage() {
  const { user, isNewUser, loginWithTelegram, devLogin } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("user");

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
          {/* Tabs */}
          <div className="flex bg-bg-alt rounded-2xl p-1 mb-8">
            <button
              onClick={() => setTab("user")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "user"
                  ? "bg-white text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Пользователь
            </button>
            <button
              onClick={() => setTab("business")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === "business"
                  ? "bg-white text-text shadow-sm"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              Бизнес
            </button>
          </div>

          {tab === "user" ? (
            <>
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

                {devLogin && (
                  <button
                    onClick={devLogin}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-colors"
                  >
                    Dev: Skip Auth
                  </button>
                )}
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
            </>
          ) : (
            <>
              {/* Business auth */}
              <div className="text-center mb-8">
                <h1 className="font-heading font-black text-3xl tracking-tight mb-3">
                  idu<span className="text-accent">.</span>{" "}
                  <span className="text-lg font-bold text-text-secondary">
                    для бизнеса
                  </span>
                </h1>
                <p className="text-text-secondary text-base leading-relaxed">
                  Продвигайте свои мероприятия
                  <br />
                  и привлекайте аудиторию
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex flex-col gap-4 mb-8"
              >
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Название компании
                  </label>
                  <input
                    type="text"
                    placeholder="ООО «Ваша компания»"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="info@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    placeholder="+375 (__) ___-__-__"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-semibold text-base transition-colors mt-2"
                >
                  Оставить заявку
                </button>
              </form>

              {/* Business benefits */}
              <div className="space-y-4">
                {[
                  {
                    icon: "📢",
                    title: "Продвижение событий",
                    desc: "Показывайте мероприятия целевой аудитории",
                  },
                  {
                    icon: "📊",
                    title: "Аналитика",
                    desc: "Отслеживайте охваты и вовлечённость",
                  },
                  {
                    icon: "🤝",
                    title: "Партнёрство",
                    desc: "Сотрудничайте с активным сообществом",
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

              <p className="text-center text-[11px] text-text-secondary/60 mt-8 leading-relaxed">
                Мы свяжемся с вами в течение 24 часов
                <br />
                после отправки заявки
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
