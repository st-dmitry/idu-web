"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Gender,
  getUser,
  getInterests,
  getUserReviews,
  createReview,
  type UserProfileResponse,
  type CategoryGroupResponse,
  type UserReviewResponse,
} from "@/lib/api";
import Navbar from "@/components/Navbar";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const GENDER_LABELS: Record<number, string> = {
  [Gender.Male]: "Мужской",
  [Gender.Female]: "Женский",
};

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

function StarRating({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
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

function InteractiveStarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= value ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={star <= value ? "text-amber-400" : "text-border"}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
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
        <StarRating rating={review.rating} size={14} />
      </div>
      {review.text && (
        <p className="text-sm text-text-secondary leading-relaxed">{review.text}</p>
      )}
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: me, token } = useAuth();
  const userId = params.id as string;

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [interestNames, setInterestNames] = useState<Record<number, string>>({});
  const [reviews, setReviews] = useState<UserReviewResponse[]>([]);

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Redirect to own profile if viewing self
  useEffect(() => {
    if (me && userId === me.id) {
      router.replace("/profile");
    }
  }, [me, userId, router]);

  useEffect(() => {
    Promise.all([
      getUser(userId, token ?? undefined),
      getInterests(),
      getUserReviews(userId),
    ])
      .then(([prof, groups, revs]) => {
        setProfile(prof);
        const names: Record<number, string> = {};
        for (const g of groups) {
          for (const c of g.categories ?? []) {
            names[c.id] = c.name ?? "";
          }
        }
        setInterestNames(names);
        setReviews(revs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-alt flex flex-col">
        <Navbar variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-alt flex flex-col">
        <Navbar variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary">Пользователь не найден</p>
        </main>
      </div>
    );
  }

  const photoUrl = profile.photoPath
    ? profile.photoPath.startsWith("http")
      ? profile.photoPath
      : `${API_BASE.replace("/api", "")}${profile.photoPath}`
    : null;

  const age = calcAge(profile.birthDate);
  const genderText = GENDER_LABELS[profile.gender] ?? "";

  async function handleSubmitReview() {
    if (!token) return;
    setSubmittingReview(true);
    try {
      const newReview = await createReview(
        userId,
        { rating: reviewRating, text: reviewText.trim() || null },
        token
      );
      setReviews((prev) => [newReview, ...prev]);
      setShowReviewForm(false);
      setReviewRating(5);
      setReviewText("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col">
      <Navbar variant="app" />

      <main className="flex-1">
        <div className="max-w-[640px] mx-auto px-6 py-10 md:py-14">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Назад
          </button>

          {/* Profile card */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-bg-alt border-2 border-border shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={profile.name ?? "Аватар"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-heading font-bold text-text-secondary">
                    {(profile.name ?? "?")[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="font-heading font-bold text-2xl mb-1">
                  {profile.name ?? "Без имени"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary mb-3">
                  {genderText && <span>{genderText}</span>}
                  {age && (
                    <>
                      {genderText && <span>·</span>}
                      <span>{age} лет</span>
                    </>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <StarRating rating={profile.rating} />
                  <span className="text-sm font-semibold">{profile.rating.toFixed(1)}</span>
                  <span className="text-xs text-text-secondary">
                    ({profile.reviewCount} {profile.reviewCount === 1 ? "отзыв" : "отзывов"})
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-6 text-sm text-text-secondary leading-relaxed">
                {profile.bio}
              </p>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {profile.interests.map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-accent-light text-accent"
                  >
                    {interestNames[id] ?? `#${id}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-3xl shadow-sm border border-border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg">
                Отзывы{" "}
                <span className="text-text-secondary font-normal text-sm">
                  ({reviews.length})
                </span>
              </h2>
              {token && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Оставить отзыв
                </button>
              )}
            </div>

            {/* Review form */}
            {showReviewForm && (
              <div className="bg-bg-alt rounded-2xl p-5 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Оценка</label>
                  <InteractiveStarRating value={reviewRating} onChange={setReviewRating} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5">Комментарий</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Расскажите о вашем опыте..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewRating(5);
                      setReviewText("");
                    }}
                    className="px-4 py-2 bg-white hover:bg-border text-text rounded-xl text-sm font-semibold transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="px-6 py-2 bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-text-secondary text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    {submittingReview ? "Отправка..." : "Отправить"}
                  </button>
                </div>
              </div>
            )}

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
