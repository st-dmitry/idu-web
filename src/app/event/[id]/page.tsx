import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventDetailClient from "./EventDetailClient";

export const metadata: Metadata = {
  title: "Событие — Idu",
  description: "Присоединяйся к событию на Idu",
};

export default function EventPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar variant="app" />
      <EventDetailClient />
      <Footer />
    </div>
  );
}
