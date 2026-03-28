import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedClient from "./FeedClient";

export const metadata: Metadata = {
  title: "Лента событий — Idu",
  description: "Найди компанию для активностей рядом с тобой",
};

export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-alt">
      <Navbar variant="app" />
      <FeedClient />
      <Footer />
    </div>
  );
}
