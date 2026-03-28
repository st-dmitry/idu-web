"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Gender, updateProfile, getInterests, type CategoryGroupResponse } from "@/lib/api";

const GENDER_OPTIONS = [
  { value: Gender.NotSpecified, label: "Не указывать" },
  { value: Gender.Male, label: "Мужской" },
  { value: Gender.Female, label: "Женский" },
];

const MAX_INTERESTS = 5;

export default function OnboardingPage() {
  const { user, token, clearNewUser, refreshUser } = useAuth();
  const router = useRouter();

  const [interestGroups, setInterestGroups] = useState<CategoryGroupResponse[]>([]);

  useEffect(() => {
    getInterests().then(setInterestGroups).catch(console.error);
  }, []);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
  const [name, setName] = useState(user?.name ?? "");
  const [gender, setGender] = useState<Gender>(Gender.NotSpecified);
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  function toggleInterest(interest: number) {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) return prev.filter((i) => i !== interest);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, interest];
    });
  }

  async function handleFinish() {
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
      clearNewUser();
      router.replace("/feed");
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-border p-8 md:p-12 max-w-[540px] w-full">
          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="font-heading font-bold text-2xl mb-2">
                  Что тебе интересно?
                </h1>
                <p className="text-text-secondary text-sm">
                  Выбери до {MAX_INTERESTS} интересов — мы подберём подходящие
                  события
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {interestGroups.map((group) => (
                  <div key={group.id}>
                    <p className="text-xs text-text-secondary mb-1.5">{group.name}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {group.categories?.map((interest) => {
                        const selected = selectedInterests.includes(interest.id);
                        return (
                          <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest.id)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              selected
                                ? "bg-accent text-white shadow-sm"
                                : selectedInterests.length >= MAX_INTERESTS
                                  ? "bg-bg-alt text-text-secondary/40 cursor-not-allowed"
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

              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {selectedInterests.length} / {MAX_INTERESTS}
                </span>
                <button
                  onClick={() => setStep(2)}
                  disabled={selectedInterests.length === 0}
                  className="px-8 py-3 bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-text-secondary text-white rounded-xl font-semibold transition-colors"
                >
                  Далее
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-heading font-bold text-2xl mb-2">
                  Расскажи о себе
                </h1>
                <p className="text-text-secondary text-sm">
                  Заполни профиль, чтобы другие участники знали тебя лучше
                </p>
              </div>

              <div className="space-y-5 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Имя *
                  </label>
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
                  <label className="block text-sm font-medium mb-1.5">
                    Пол
                  </label>
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
                  <label className="block text-sm font-medium mb-1.5">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    О себе
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="Пару слов о себе..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-bg-alt hover:bg-border text-text rounded-xl font-semibold transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={handleFinish}
                  disabled={!name.trim() || saving}
                  className="flex-1 py-3 bg-accent hover:bg-accent-hover disabled:bg-border disabled:text-text-secondary text-white rounded-xl font-semibold transition-colors"
                >
                  {saving ? "Сохранение..." : "Начать"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
