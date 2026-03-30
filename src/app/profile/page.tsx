"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Gender,
  updateProfile,
  uploadProfilePhoto,
  getInterests,
  getUserReviews,
  type CategoryGroupResponse,
  type UserReviewResponse,
} from "@/lib/api";
import Navbar from "@/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const GENDER_OPTIONS = [
  { value: Gender.NotSpecified, label: "Не указывать" },
  { value: Gender.Male, label: "Мужской" },
  { value: Gender.Female, label: "Женский" },
];

function genderLabel(g: Gender): string {
  return GENDER_OPTIONS.find((o) => o.value === g)?.label ?? "";
}

function calcAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const parts = birthDate.split("T")[0].split("-");
  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);
  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return null;
  const now = new Date();
  let age = now.getFullYear() - birthYear;
  const m = now.getMonth() - birthMonth;
  if (m < 0 || (m === 0 && now.getDate() < birthDay)) age--;
  return age > 0 ? age : null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={star <= Math.round(rating) ? "text-amber-400" : "text-border"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: UserReviewResponse }) {
  const date = new Date(review.createdAt);
  const formatted = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-bg-alt rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm">{review.fromUserName ?? "Аноним"}</span>
        <span className="text-xs text-text-secondary">{formatted}</span>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={star <= review.rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={star <= review.rating ? "text-amber-400" : "text-border"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      {review.text && (
        <p className="text-sm text-text-secondary leading-relaxed">{review.text}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, token, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.NotSpecified);
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const [interestGroups, setInterestGroups] = useState<CategoryGroupResponse[]>([]);
  const [interestNames, setInterestNames] = useState<Record<number, string>>({});
  const [reviews, setReviews] = useState<UserReviewResponse[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user && !token) return;
    getInterests().then((groups) => {
      setInterestGroups(groups);
      const names: Record<number, string> = {};
      for (const g of groups) {
        for (const c of g.categories ?? []) {
          names[c.id] = c.name ?? "";
        }
      }
      setInterestNames(names);
    });
  }, [user, token]);

  useEffect(() => {
    if (!user) return;
    getUserReviews(user.id).then(setReviews).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setGender(user.gender);
    setBirthDate(user.birthDate ?? "");
    setBio(user.bio ?? "");
    setSelectedInterests(user.interests ?? []);
  }, [user]);

  if (!user || !token) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Войдите, чтобы увидеть профиль</p>
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-colors"
            >
              Войти
            </button>
          </div>
        </main>
      </div>
    );
  }

  const photoUrl = user.photoPath
    ? user.photoPath.startsWith("http")
      ? user.photoPath
      : `${API_BASE.replace("/api", "")}${user.photoPath}`
    : null;

  const age = calcAge(user.birthDate);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploading(true);
    try {
      await uploadProfilePhoto(file, token);
      await refreshUser();
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function toggleInterest(id: number) {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);

      return [...prev, id];
    });
  }

  async function handleSave() {
    if (!token || !name.trim()) return;
    setSaving(true);
    try {
      await updateProfile(
        {
          name: name.trim(),
          gender,
          birthDate: birthDate || undefined,
          bio: bio.trim() || null,
          interests: selectedInterests.length > 0 ? selectedInterests : null,
        },
        token
      );
      await refreshUser();
      setEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col">
      <Navbar variant="app" />

      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6 py-10 md:py-14">
          {/* Profile header */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-bg-alt border-2 border-border">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={user.name ?? "Аватар"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-heading font-bold text-text-secondary">
                      {(user.name ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent hover:bg-accent-hover text-white rounded-full flex items-center justify-center shadow-sm transition-colors"
                >
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading font-bold text-2xl mb-1">
                  {user.name ?? "Без имени"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary mb-3">
                  {genderLabel(user.gender) && user.gender !== Gender.NotSpecified && (
                    <span>{genderLabel(user.gender)}</span>
                  )}
                  {age && (
                    <>
                      {user.gender !== Gender.NotSpecified && <span>·</span>}
                      <span>{age} лет</span>
                    </>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <StarRating rating={user.rating} />
                  <span className="text-sm font-semibold">{user.rating.toFixed(1)}</span>
                  <span className="text-xs text-text-secondary">
                    ({user.reviewCount} {user.reviewCount === 1 ? "отзыв" : "отзывов"})
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && !editing && (
              <p className="mt-6 text-sm text-text-secondary leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Interests */}
            {!editing && user.interests && user.interests.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {user.interests.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-accent-light text-accent"
                  >
                    {interestNames[id] ?? `#${id}`}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            {!editing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-colors text-sm"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="px-6 py-3 bg-bg-alt hover:bg-border text-text-secondary rounded-xl font-semibold transition-colors text-sm"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>

          {/* Edit form */}
          {editing && (
            <div className="bg-white rounded-3xl shadow-sm border border-border p-8 mb-6">
              <h2 className="font-heading font-bold text-lg mb-6">Редактирование</h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Имя *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder="Как тебя зовут?"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Пол</label>
                  <div className="flex gap-2">
                    {GENDER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGender(opt.value)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                          gender === opt.value
                            ? "bg-accent text-white"
                            : "bg-bg-alt text-text hover:bg-border"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birth date */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Дата рождения</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">О себе</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Пару слов о себе..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Интересы ({selectedInterests.length}/5)
                  </label>
                  <div className="space-y-3">
                    {interestGroups.map((group) => (
                      <div key={group.id}>
                        <p className="text-xs text-text-secondary mb-1.5">{group.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {group.categories?.map((interest) => {
                            const selected = selectedInterests.includes(interest.id);
                            return (
                              <button
                                key={interest.id}
                                onClick={() => toggleInterest(interest.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                  selected
                                    ? "bg-accent text-white shadow-sm"
                                    : "bg-bg-alt text-text hover:bg-border"
                                }`}
                              >
                                {interest.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user.name ?? "");
                    setGender(user.gender);
                    setBirthDate(user.birthDate ?? "");
                    setBio(user.bio ?? "");
                    setSelectedInterests(user.interests ?? []);
                  }}
                  className="px-6 py-3 bg-bg-alt hover:bg-border text-text rounded-xl font-semibold transition-colors text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name.trim() || saving}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-text-secondary text-white rounded-xl font-semibold transition-colors text-sm"
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-8">
            <h2 className="font-heading font-bold text-lg mb-6">
              Отзывы{" "}
              <span className="text-text-secondary font-normal text-sm">
                ({reviews.length})
              </span>
            </h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-text-secondary text-center py-6">
                Пока нет отзывов
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
