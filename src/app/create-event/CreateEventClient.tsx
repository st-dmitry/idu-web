"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  type CategoryGroupResponse,
  createEvent,
  uploadEventPhoto,
  getCategories,
} from "@/lib/api";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
});

export default function CreateEventClient() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupResponse[]>([]);

  useEffect(() => {
    getCategories().then(setCategoryGroups).catch(console.error);
  }, []);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<number | undefined>(undefined);
  const [categorySearch, setCategorySearch] = useState("");
  const [startTime, setStartTime] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [maxParticipantsStr, setMaxParticipantsStr] = useState("10");
  const [cost, setCost] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      router.push("/auth");
      return;
    }
    if (!title.trim() || !startTime) return;

    const eventDate = new Date(startTime);
    const minDate = new Date(Date.now() + 60 * 60 * 1000);
    if (eventDate < minDate) {
      setError("Событие можно создать минимум за час до начала");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const event = await createEvent(
        {
          title: title.trim(),
          category,
          startTime: new Date(startTime).toISOString(),
          latitude,
          longitude,
          city: city.trim() || null,
          description: description.trim() || null,
          maxParticipants: Number(maxParticipantsStr) || 10,
          cost: cost ? Number(cost) : null,
          isPublic: true,
        },
        token
      );

      if (photo) {
        await uploadEventPhoto(event.id, photo, token);
      }

      router.push(`/event/${event.id}`);
    } catch (err) {
      console.error("Failed to create event:", err);
      setError("Не удалось создать событие. Попробуй ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  if (!user || !token) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🔒</p>
          <h2 className="font-heading font-bold text-xl mb-2">Войди, чтобы создать событие</h2>
          <p className="text-text-secondary text-sm mb-6">
            Для создания события нужна авторизация
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-colors"
          >
            Войти
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-[640px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-text mb-2">
            Создать событие
          </h1>
          <p className="text-text-secondary text-sm">
            Заполни информацию и найди компанию
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-border p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Название *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Например: Волейбол в парке Горького"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Категория
              </label>
              <div className="relative mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Поиск категории..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>
              <div className="space-y-3 max-h-[240px] overflow-y-auto">
                {categoryGroups
                  .map((group) => {
                    const filtered = group.categories?.filter((cat) =>
                      !categorySearch ||
                      (cat.name ?? "").toLowerCase().includes(categorySearch.toLowerCase())
                    );
                    if (!filtered || filtered.length === 0) return null;
                    return (
                      <div key={group.id}>
                        <p className="text-xs text-text-secondary mb-1.5">{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {filtered.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategory(cat.id)}
                              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                                category === cat.id
                                  ? "bg-accent text-white shadow-sm"
                                  : "bg-bg-alt text-text hover:bg-border"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Дата и время *
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                className="w-full min-w-0 max-w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                required
              />
            </div>

            {/* Location */}
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              city={city}
              onLocationChange={(loc) => {
                setLatitude(loc.latitude);
                setLongitude(loc.longitude);
                setCity(loc.city);
              }}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={4}
                placeholder="Расскажи подробнее о событии..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
              />
            </div>

            {/* Max participants & Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Макс. участников
                </label>
                <input
                  type="number"
                  min={2}
                  max={1000}
                  value={maxParticipantsStr}
                  onChange={(e) => setMaxParticipantsStr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Стоимость
                </label>
                <input
                  type="number"
                  min={0}
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0 = бесплатно"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Фото
              </label>
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/70 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-bg-alt transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-text-secondary mb-2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-sm text-text-secondary">
                    Нажми, чтобы загрузить
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!title.trim() || !startTime || saving}
              className="w-full py-3.5 bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-text-secondary text-white rounded-xl font-semibold transition-colors text-base"
            >
              {saving ? "Создание..." : "Создать событие"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
