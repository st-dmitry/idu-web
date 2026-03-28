import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MyEventsClient from "./MyEventsClient";

export const metadata = {
  title: "Мои события — idu.",
  description: "Твои созданные события и участия",
};

export default function MyEventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-alt">
      <Navbar variant="app" />
      <MyEventsClient />
      <Footer />
    </div>
  );
}
