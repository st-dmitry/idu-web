import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const marqueeItems = [
    "СПОРТ",
    "КИНО",
    "ПОХОДЫ",
    "ЕДА",
    "НАСТОЛКИ",
    "КОНЦЕРТЫ",
    "ВЕЛОПРОГУЛКИ",
    "ЙОГА",
  ];

  const categories = [
    { emoji: "🏃", label: "Бег и фитнес" },
    { emoji: "🎬", label: "Кино" },
    { emoji: "⛺", label: "Походы" },
    { emoji: "🍜", label: "Еда" },
    { emoji: "🎲", label: "Настолки" },
    { emoji: "🚴", label: "Велопрогулки" },
    { emoji: "🎵", label: "Концерты" },
    { emoji: "🧘", label: "Йога" },
    { emoji: "🎨", label: "Творчество" },
    { emoji: "🏊", label: "Плавание" },
    { emoji: "📚", label: "Книжный клуб" },
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
          `,
        }}
      />

      <Navbar variant="landing" />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 pt-10 pb-14 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="max-w-xl">
              <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-4">
                Найди компанию для любой активности
              </p>
              <h1
                className="font-heading font-black leading-[1.1] mb-6"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.75rem)" }}
              >
                Хочешь куда-то{" "}
                <span className="text-accent">пойти?</span>
              </h1>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md">
                Idu — это платформа, где люди находят компанию для спорта, кино,
                походов, настолок и любых других активностей. Присоединяйся к
                событиям рядом или создавай свои.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.02] no-underline"
              >
                Найти компанию&nbsp;&rarr;
              </Link>
              <p className="mt-4 text-sm text-text-secondary">
                Вход через Telegram &middot; бесплатно
              </p>
            </div>

            {/* Right — phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full bg-accent/[0.06] blur-3xl" />
              </div>

              {/* Phone */}
              <div className="relative w-[280px] md:w-[300px] bg-white rounded-[40px] border-[3px] border-[#E0E0E0] shadow-xl overflow-hidden">
                {/* Notch */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-[90px] h-[26px] bg-[#1B1B1B] rounded-full" />
                </div>

                {/* Screen content */}
                <div className="px-4 pb-6 flex flex-col gap-3">
                  <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider px-1">
                    События рядом
                  </p>

                  {/* Card 1 — Спорт */}
                  <div className="bg-white border border-border rounded-2xl p-3.5 shadow-sm">
                    <span className="inline-block bg-accent-light text-accent text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                      🏃 Спорт
                    </span>
                    <p className="font-heading font-bold text-sm leading-snug mb-1.5">
                      Утренняя пробежка в парке
                    </p>
                    <p className="text-[11px] text-text-secondary mb-2.5">
                      Сб, 09:00 · Парк Горького · 4/8
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold">
                      Иду&nbsp;&rarr;
                    </span>
                  </div>

                  {/* Card 2 — Кино */}
                  <div className="bg-white border border-border rounded-2xl p-3.5 shadow-sm">
                    <span className="inline-block bg-accent-light text-accent text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                      🎬 Кино
                    </span>
                    <p className="font-heading font-bold text-sm leading-snug mb-1.5">
                      Вечер артхаусного кино
                    </p>
                    <p className="text-[11px] text-text-secondary mb-2.5">
                      Пт, 19:30 · Кинотеатр «Октябрь» · 6/10
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold">
                      Иду&nbsp;&rarr;
                    </span>
                  </div>

                  {/* Card 3 — Еда */}
                  <div className="bg-white border border-border rounded-2xl p-3.5 shadow-sm">
                    <span className="inline-block bg-accent-light text-accent text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2">
                      🍜 Еда
                    </span>
                    <p className="font-heading font-bold text-sm leading-snug mb-1.5">
                      Фуд-тур по грузинским кафе
                    </p>
                    <p className="text-[11px] text-text-secondary mb-2.5">
                      Вс, 13:00 · Центр · 3/6
                    </p>
                    <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold">
                      Иду&nbsp;&rarr;
                    </span>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-[100px] h-[4px] bg-[#D1D5DB] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <section className="bg-bg-alt py-5 overflow-hidden border-y border-border">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 20s linear infinite" }}
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

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
            Как это работает
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-14">
            Три простых шага
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "👤",
                title: "Создай аккаунт",
                desc: "Войди через Telegram за пару секунд — никаких паролей и длинных форм.",
              },
              {
                icon: "🗓",
                title: "Найди или создай ивент",
                desc: "Смотри события рядом с тобой или создай своё за минуту.",
              },
              {
                icon: "🔥",
                title: "Иди и знакомься",
                desc: "Приходи, общайся и заводи новых друзей с общими интересами.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-5">{step.icon}</div>
                <h3 className="font-heading font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-bg-alt py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
            Возможности
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-14">
            Всё, что нужно
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Big card — spans 2 cols on lg */}
            <div className="md:col-span-2 lg:col-span-2 bg-white border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="flex-1">
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
              {/* Mini phone mockup */}
              <div className="shrink-0 w-[180px] bg-white rounded-[28px] border-2 border-[#E0E0E0] shadow-lg overflow-hidden self-center">
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-[56px] h-[18px] bg-[#1B1B1B] rounded-full" />
                </div>
                <div className="px-2.5 pb-3 flex flex-col gap-2">
                  <div className="bg-white border border-border rounded-xl p-2.5">
                    <span className="inline-block bg-accent-light text-accent text-[8px] font-semibold px-2 py-0.5 rounded-full mb-1">
                      🏃 Спорт
                    </span>
                    <p className="font-heading font-bold text-[10px] leading-tight">
                      Бег в Сокольниках
                    </p>
                    <p className="text-[8px] text-text-secondary mt-0.5">
                      Сб, 08:00 · 5/10
                    </p>
                  </div>
                  <div className="bg-white border border-border rounded-xl p-2.5">
                    <span className="inline-block bg-accent-light text-accent text-[8px] font-semibold px-2 py-0.5 rounded-full mb-1">
                      🎲 Настолки
                    </span>
                    <p className="font-heading font-bold text-[10px] leading-tight">
                      Вечер настолок
                    </p>
                    <p className="text-[8px] text-text-secondary mt-0.5">
                      Пт, 19:00 · 7/8
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pb-1.5">
                  <div className="w-[60px] h-[3px] bg-[#D1D5DB] rounded-full" />
                </div>
              </div>
            </div>

            {/* Small card 1 */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <span className="inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Чат
              </span>
              <h3 className="font-heading font-bold text-lg mb-2">
                Чат сразу в Telegram
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Для каждого ивента создаётся Telegram-чат. Общайся с участниками
                ещё до встречи.
              </p>
            </div>

            {/* Small card 2 */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <span className="inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Профиль
              </span>
              <h3 className="font-heading font-bold text-lg mb-2">
                Твоя история активностей
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Все твои события, отзывы и знакомства — в одном месте. Строй свою
                репутацию.
              </p>
            </div>

            {/* Small card 3 */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <span className="inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Приватность
              </span>
              <h3 className="font-heading font-bold text-lg mb-2">
                Публичные и приватные ивенты
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Открытые события видят все, а приватные — только по приглашению.
                Ты решаешь.
              </p>
            </div>

            {/* Small card 4 */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-md transition-shadow">
              <span className="inline-block bg-accent-light text-accent text-[11px] font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Гибкость
              </span>
              <h3 className="font-heading font-bold text-lg mb-2">
                Платные и бесплатные события
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Создавай бесплатные встречи или организуй платные мероприятия — всё
                в одном месте.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <p className="uppercase text-accent tracking-widest text-xs font-semibold mb-3 text-center">
            Категории
          </p>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-center mb-12">
            Активности на любой вкус
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <span
                key={i}
                className="bg-white border border-border rounded-full px-5 py-3 text-sm font-medium hover:border-accent hover:text-accent transition-colors cursor-pointer"
              >
                {cat.emoji}&nbsp;&nbsp;{cat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PREMIUM ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <div className="bg-accent rounded-[20px] px-6 py-10 md:px-14 md:py-16 text-white">
            <div className="max-w-2xl mx-auto text-center">
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
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{perk.icon}</span>
                    <span className="text-sm font-medium text-white/90">
                      {perk.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-[#1B1B1B] hover:bg-[#333] text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.02] no-underline"
              >
                Попробовать Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-14 md:py-28 bg-bg-alt">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "10+", label: "категорий активностей" },
              { value: "0₽", label: "чтобы начать" },
              { value: "СНГ", label: "доступно везде" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-2xl p-10 text-center"
              >
                <div className="font-heading font-black text-4xl md:text-6xl text-accent mb-3">
                  {stat.value}
                </div>
                <p className="text-text-secondary text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-14 md:py-28">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center">
          <h2 className="font-heading font-black text-3xl md:text-5xl mb-5">
            Хватит ходить{" "}
            <span className="text-accent">одному</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto">
            Присоединяйся к тысячам людей, которые уже нашли компанию для своих
            любимых активностей.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-full px-7 py-4 text-base transition-all hover:scale-[1.02] no-underline"
            >
              Найти ивент&nbsp;&rarr;
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 border border-border text-text font-medium rounded-full px-7 py-4 text-base hover:bg-bg-alt transition-colors no-underline"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Наш Telegram
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
