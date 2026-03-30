import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailClient from "./EventDetailClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/Events/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Событие — Idu",
        description: "Присоединяйся к событию на Idu",
      };
    }

    const event = await res.json();
    const title = event.title ? `${event.title} — Idu` : "Событие — Idu";
    const description =
      event.description?.slice(0, 200) ||
      "Присоединяйся к событию на Idu";

    const ogImage = event.photoPath
      ? event.photoPath.startsWith("http")
        ? event.photoPath
        : `${API_BASE.replace("/api", "")}${event.photoPath}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "ru_RU",
        ...(ogImage && { images: [{ url: ogImage }] }),
      },
    };
  } catch {
    return {
      title: "Событие — Idu",
      description: "Присоединяйся к событию на Idu",
    };
  }
}

export default function EventPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar variant="app" />
      <EventDetailClient />
      <Footer />
    </div>
  );
}
