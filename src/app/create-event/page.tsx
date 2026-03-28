import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateEventClient from "./CreateEventClient";

export const metadata = {
  title: "Создать событие — idu.",
  description: "Создай событие и найди компанию",
};

export default function CreateEventPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-alt">
      <Navbar variant="app" />
      <CreateEventClient />
      <Footer />
    </div>
  );
}
