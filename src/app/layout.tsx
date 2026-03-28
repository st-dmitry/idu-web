import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Idu — найди компанию",
  description:
    "Создай событие или присоединись к чужому. Бег, кино, поход — находи людей с теми же планами прямо сейчас.",
  openGraph: {
    title: "Idu — найди компанию",
    description:
      "Создай событие или присоединись к чужому. Бег, кино, поход — находи людей.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;400;700;900&family=Onest:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
