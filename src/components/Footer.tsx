import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-5 py-8 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="font-heading font-black text-lg tracking-tight">
          idu<span className="text-accent">.</span>
        </div>

        <div className="flex gap-6 flex-wrap">
          <Link href="#" className="text-sm text-text-secondary hover:text-text transition-colors no-underline">
            О проекте
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text transition-colors no-underline">
            Telegram
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text transition-colors no-underline">
            Поддержка
          </Link>
          <Link href="#" className="text-sm text-text-secondary hover:text-text transition-colors no-underline">
            Конфиденциальность
          </Link>
        </div>

        <div className="text-xs text-text-secondary/60">
          &copy; {new Date().getFullYear()} idu
        </div>
      </div>
    </footer>
  );
}
