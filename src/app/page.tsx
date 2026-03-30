"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import {
  type EventResponse,
  type CategoryGroupResponse,
  getEvents,
  getCategories,
} from "@/lib/api";
import { useRef, useState, useEffect, useCallback } from "react";

/* ── Scroll-triggered reveal ── */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const num = parseInt(value);
  const isNumeric = !isNaN(num);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isNumeric) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = num;
          const step = Math.max(1, Math.floor(end / 60));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setDisplayed(String(end));
              clearInterval(timer);
            } else {
              setDisplayed(String(start));
            }
          }, 16);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, isNumeric]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

/* ── Rotating words ── */
const rotatingWords = ["пойти?", "побежать?", "поехать?", "сходить?", "поиграть?"];

function RotatingText() {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState<"in" | "out">("in");

  useEffect(() => {
    const id = setInterval(() => {
      setAnimState("out");
      setTimeout(() => {
        setIndex((i) => (i + 1) % rotatingWords.length);
        setAnimState("in");
      }, 350);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-block relative overflow-hidden">
      <span
        className={`inline-block text-accent transition-all duration-350 ease-out ${
          animState === "in"
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 opacity-0"
        }`}
      >
        {rotatingWords[index]}
      </span>
    </span>
  );
}

function buildCategoryNameMap(groups: CategoryGroupResponse[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const group of groups) {
    for (const cat of group.categories ?? []) {
      map[cat.id] = cat.name ?? "Другое";
    }
  }
  return map;
}

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [liveEvents, setLiveEvents] = useState<EventResponse[]>([]);
  const [categoryNames, setCategoryNames] = useState<Record<number, string>>({});
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setHeroVisible(true));
    // Fetch events and categories without auth
    Promise.all([getEvents({ pageSize: 6 }), getCategories()])
      .then(([events, cats]) => {
        setLiveEvents(events);
        setCategoryNames(buildCategoryNameMap(cats));
      })
      .catch(() => {})
      .finally(() => setEventsLoading(false));
  }, []);

  const marqueeItems = [
    "СПОРТ", "КИНО", "ПОХОДЫ", "ЕДА", "НАСТОЛКИ", "КОНЦЕРТЫ",
    "ВЕЛОПРОГУЛКИ", "ЙОГА", "КВИЗЫ", "СТЕНДАП", "ТВОРЧЕСТВО",
  ];

  const categories = [
    { emoji: "🏃", label: "Бег и фитнес" },
    { emoji: "🎬", label: "Кино" },
    { emoji: "⛺", label: "Походы" },
    { emoji: "🍜", label: "Еда и кофе" },
    { emoji: "🎲", label: "Настолки" },
    { emoji: "🚴", label: "Велопрогулки" },
    { emoji: "🎵", label: "Концерты" },
    { emoji: "🧘", label: "Йога" },
    { emoji: "🎨", label: "Творчество" },
    { emoji: "🏊", label: "Плавание" },
    { emoji: "📚", label: "Книжный клуб" },
    { emoji: "🎤", label: "Стендап" },
    { emoji: "🧩", label: "Квизы" },
    { emoji: "➕", label: "И многое другое" },
  ];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-12px); }
            }
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes pulse-glow {
              0%, 100% { transform: scale(1); opacity: 0.06; }
              50% { transform: scale(1.15); opacity: 0.10; }
            }
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-slow-reverse {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            @keyframes blob-move-1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              33% { transform: translate(30px, -20px) scale(1.1); }
              66% { transform: translate(-10px, 15px) scale(0.95); }
            }
            @keyframes blob-move-2 {
              0%, 100% { transform: translate(0, 0) scale(1.05); }
              33% { transform: translate(-20px, 10px) scale(1); }
              66% { transform: translate(15px, -25px) scale(1.1); }
            }
            @keyframes arrow-bounce {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(4px); }
            }
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes scale-in {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .hover-lift {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .hover-lift:hover {
              transform: translateY(-6px);
              box-shadow: 0 12px 40px rgba(0,0,0,0.08);
            }
            .hover-scale {
              transition: transform 0.25s ease;
            }
            .hover-scale:hover {
              transform: scale(1.06) translateY(-2px);
            }
            .group:hover .tag-flip {
              background: var(--color-accent);
              color: white;
            }
            .bottom-bar {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 3px;
              width: 0;
              background: var(--color-accent);
              transition: width 0.5s ease;
            }
            .group:hover .bottom-bar {
              width: 100%;
            }
            .btn-shimmer {
              position: relative;
              overflow: hidden;
            }
            .btn-shimmer::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
              animation: shimmer 2.5s ease infinite;
            }
          `,
        }}
      />

      <Navbar variant="landing" />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-3xl"
            style={{ animation: "blob-move-1 8s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-3xl"
            style={{ animation: "blob-move-2 10s ease-in-out infinite" }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-5 md:px-12 pt-10 pb-14 md:pt-16 md:pb-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — copy */}
            <div className="max-w-xl">
              <p
                className={`uppercase text-accent tracking-widest text-xs font-semibold mb-4 transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                Найди компанию для любой активности
              </p>

              <h1
                className={`font-heading font-black leading-[1.1] mb-6 transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.75rem)", transitionDelay: "200ms" }}
              >
                Хочешь куда-то <br />
                <RotatingText />
              </h1>

              <p
                className={`text-text-secondary text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                Idu — платформа, где люди находят компанию для спорта, кино,
                походов, настолок и любых других активностей. Присоединяйся или
                создавай свои события.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "550ms" }}
              >
                <Link
                  href="/auth"
                  className="btn-shimmer group inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.03] active:scale-[0.98] no-underline"
                >
                  <span className="relative z-10">Начать бесплатно</span>
                  <span
                    className="relative z-10"
                    style={{ animation: "arrow-bounce 1.5s ease infinite" }}
                  >
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 border border-border text-text font-medium rounded-full px-7 py-4 text-base hover:bg-bg-alt hover:border-accent/30 transition-all active:scale-[0.98] no-underline"
                >
                  Смотреть ивенты
                </Link>
              </div>

              <p
                className={`mt-4 text-sm text-text-secondary transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                Вход через Telegram &middot; без паролей &middot; бесплатно
              </p>
            </div>

            {/* Right — phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-[340px] h-[340px] rounded-full bg-accent/[0.07] blur-3xl"
                  style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
                />
              </div>

              {/* Phone */}
              <div
                className={`relative w-[280px] md:w-[300px] bg-white rounded-[40px] border-[3px] border-[#E0E0E0] shadow-xl overflow-hidden transition-all duration-900 ease-out ${
                  heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                {/* Notch */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-[90px] h-[26px] bg-[#1B1B1B] rounded-full" />
                </div>

                {/* Screen content */}
                <div className="px-4 pb-6 flex flex-col gap-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-1">
                    События рядом
                  </p>

                  {[
                    {
                      tag: "🏃 Спорт",
                      title: "Утренняя пробежка в парке",
                      meta: "Сб, 09:00 · Парк Горького · 4/8",
                      delay: "600ms",
                    },
                    {
                      tag: "🎲 Настолки",
                      title: "Вечер настолок в антикафе",
                      meta: "Пт, 19:30 · Циферблат · 6/10",
                      delay: "800ms",
                    },
                    {
                      tag: "🎤 Стендап",
                      title: "Открытый микрофон",
                      meta: "Чт, 20:00 · Бар «Стакан» · 12/15",
                      delay: "1000ms",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className={`bg-white border border-border rounded-2xl p-3.5 shadow-sm hover-lift cursor-pointer transition-all duration-700 ease-out ${
                        heroVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
                      }`}
                      style={{ transitionDelay: card.delay }}
                    >
                      <span className="inline-block bg-accent-light text-accent text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                        {card.tag}
                      </span>
                      <p className="font-heading font-bold text-sm leading-snug mb-1.5">
                        {card.title}
                      </p>
                      <p className="text-[11px] text-text-secondary mb-2.5">
                        {card.meta}
                      </p>
                      <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold">
                        Иду&nbsp;&rarr;
                      </span>
                    </div>
                  ))}
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-[100px] h-[4px] bg-[#D1D5DB] rounded-full" />
                </div>
              </div>

              {/* Floating badge — top right */}
              <div
                className={`absolute -top-2 -right-4 md:right-0 bg-white border border-border rounded-2xl px-4 py-3 shadow-lg transition-all duration-700 ease-out ${
                  heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
                }`}
                style={{
                  transitionDelay: "1200ms",
                  animation: heroVisible ? "float 3s ease-in-out infinite 1.5s" : "none",
                }}
              >
                <p className="text-[11px] font-semibold text-text-secondary">Новое рядом</p>
                <p className="font-heading font-bold text-lg text-accent">+12</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <section className="bg-bg-alt py-5 overflow-hidden border-y border-border">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-4 px-4 text-sm font-semibold text-text-secondary uppercase tracking-wider shrink-0"
            >
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            </span>
          ))}
        </div>
      </section>

      {/* ─── LIVE EVENTS ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <Reveal>
            <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
              Прямо сейчас
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-4">
              Актуальные события
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-md mx-auto">
              Присоединяйся к ближайшим ивентам — регистрация не нужна, чтобы посмотреть
            </p>
          </Reveal>

          {eventsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : liveEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {liveEvents.slice(0, 6).map((ev, i) => (
                  <Reveal key={ev.id} delay={i * 80}>
                    <EventCard
                      id={ev.id}
                      title={ev.title ?? "Без названия"}
                      categoryName={categoryNames[ev.category] ?? "Другое"}
                      dateTime={ev.startTime}
                      location={ev.city ?? "Не указано"}
                      currentPeople={ev.currentParticipants}
                      maxPeople={ev.maxParticipants}
                      price={ev.cost ?? 0}
                      photoPath={ev.photoPath}
                      isJoined={ev.isJoinedByMe}
                    />
                  </Reveal>
                ))}
              </div>

              <Reveal delay={200}>
                <div className="flex justify-center mt-10">
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-8 py-4 text-base transition-all hover:scale-[1.03] active:scale-[0.98] no-underline"
                  >
                    Смотреть все события&nbsp;&rarr;
                  </Link>
                </div>
              </Reveal>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg mb-6">
                Пока нет активных событий — будь первым!
              </p>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.03] no-underline"
              >
                Перейти в ленту&nbsp;&rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <Reveal>
            <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
              Как это работает
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-14">
              Три простых шага
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: "👤",
                title: "Создай аккаунт",
                desc: "Войди через Telegram за пару секунд — никаких паролей и длинных форм.",
              },
              {
                num: "02",
                icon: "🗓",
                title: "Найди или создай ивент",
                desc: "Смотри события рядом с тобой или создай своё за минуту.",
              },
              {
                num: "03",
                icon: "🔥",
                title: "Иди и знакомься",
                desc: "Приходи, общайся и заводи новых друзей с общими интересами.",
              },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="group relative bg-white border border-border rounded-2xl p-8 hover-lift overflow-hidden">
                  <span className="absolute top-4 right-4 font-heading font-black text-6xl text-accent/[0.06] select-none">
                    {step.num}
                  </span>
                  <div className="text-4xl mb-5">{step.icon}</div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="bottom-bar" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-bg-alt py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <Reveal>
            <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
              Возможности
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-14">
              Всё, что нужно
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Big card */}
            <Reveal className="md:col-span-2 lg:col-span-2">
              <div className="bg-white border border-border rounded-2xl p-6 md:p-8 hover-lift">
                  <span className="inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                    Главное
                  </span>
                  <h3 className="font-heading font-bold text-xl mb-3">
                    Лента событий рядом с тобой
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Персонализированная лента активностей поблизости. Фильтруй по
                    категориям, дате и расстоянию. Находи то, что подходит именно тебе.
                  </p>
              </div>
            </Reveal>

            {/* Feature cards */}
            {[
              {
                tag: "Чат",
                title: "Чат сразу в Telegram",
                desc: "Для каждого ивента создаётся Telegram-чат. Общайся с участниками ещё до встречи.",
              },
              {
                tag: "Профиль",
                title: "Твоя история активностей",
                desc: "Все твои события, отзывы и знакомства — в одном месте. Строй свою репутацию.",
              },
              {
                tag: "Приватность",
                title: "Публичные и приватные ивенты",
                desc: "Открытые события видят все, а приватные — только по приглашению. Ты решаешь.",
              },
              {
                tag: "Гибкость",
                title: "Платные и бесплатные события",
                desc: "Создавай бесплатные встречи или организуй платные мероприятия — всё в одном месте.",
              },
            ].map((feat, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group bg-white border border-border rounded-2xl p-8 hover-lift h-full">
                  <span className="tag-flip inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider transition-all duration-300">
                    {feat.tag}
                  </span>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-14 md:py-28 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <Reveal>
            <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
              Категории
            </p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-12">
              Активности на любой вкус
            </h2>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <Reveal key={i} delay={i * 40}>
                <span className="inline-flex bg-white border border-border rounded-full px-5 py-3 text-sm font-medium hover:border-accent hover:text-accent hover:shadow-md hover-scale cursor-pointer transition-all duration-250">
                  {cat.emoji}&nbsp;&nbsp;{cat.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREMIUM ─── */}
      <Reveal>
        <section className="py-14 md:py-28">
          <div className="max-w-[1200px] mx-auto px-5 md:px-12">
            <div className="relative bg-accent rounded-[24px] px-6 py-10 md:px-14 md:py-16 text-white overflow-hidden">
              {/* Animated circles in background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px]">
                <div
                  className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full border border-white/10"
                  style={{ animation: "spin-slow 30s linear infinite" }}
                />
                <div
                  className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full border border-white/10"
                  style={{ animation: "spin-slow-reverse 40s linear infinite" }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-white/[0.04]"
                  style={{ animation: "pulse-glow 5s ease-in-out infinite" }}
                />
              </div>

              <div className="max-w-2xl mx-auto text-center relative z-10">
                <h2 className="font-heading font-black text-3xl md:text-4xl mb-4">
                  Больше событий. Больше людей.
                </h2>
                <p className="text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                  Премиум-подписка открывает дополнительные возможности для
                  организаторов и активных участников.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
                  {[
                    { icon: "∞", label: "Неограниченные ивенты" },
                    { icon: "👥", label: "Больше участников" },
                    { icon: "⚡", label: "Продвижение в ленте" },
                  ].map((perk, i) => (
                    <Reveal key={i} delay={i * 150}>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{perk.icon}</span>
                        <span className="text-sm font-medium text-white/90">
                          {perk.label}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 bg-[#1B1B1B] hover:bg-[#333] text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.05] active:scale-[0.97] no-underline"
                >
                  Попробовать Premium
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ─── STATS ─── */}
      <section className="py-14 md:py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "14", suffix: "+", label: "категорий активностей" },
              { value: "0 BYN", suffix: "", label: "чтобы начать" },
              { value: "СНГ", suffix: "", label: "доступно везде" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="bg-white border border-border rounded-2xl p-10 text-center hover-lift">
                  <div className="font-heading font-black text-4xl md:text-6xl text-accent mb-3">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-text-secondary text-sm font-medium">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-14 md:py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.03] blur-3xl"
            style={{ animation: "pulse-glow 6s ease-in-out infinite" }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center relative z-10">
          <Reveal>
            <h2 className="font-heading font-black text-3xl md:text-5xl mb-5">
              Хватит ходить{" "}
              <span className="text-accent">одному</span>
            </h2>
            <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
              Присоединяйся к людям, которые уже нашли компанию для своих
              любимых активностей.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/feed"
                className="btn-shimmer inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.05] active:scale-[0.97] no-underline"
              >
                <span className="relative z-10">Найти ивент&nbsp;&rarr;</span>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 border border-border text-text font-medium rounded-full px-7 py-4 text-base hover:bg-bg-alt hover:border-accent/30 transition-all active:scale-[0.97] no-underline"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Наш Telegram
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
