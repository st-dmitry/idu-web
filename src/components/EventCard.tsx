import Link from "next/link";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace("/api", "");

interface EventCardProps {
  id: string;
  title: string;
  categoryName: string;
  dateTime: string;
  location: string;
  currentPeople: number;
  maxPeople: number;
  price: number;
  photoPath?: string | null;
  participantsPreview?: { name: string }[];
  isJoined?: boolean;
}

export default function EventCard({
  id,
  title,
  categoryName,
  dateTime,
  location,
  currentPeople,
  maxPeople,
  price,
  photoPath,
  participantsPreview,
  isJoined,
}: EventCardProps) {
  const label = categoryName || "Другое";

  const date = new Date(dateTime);
  const formatted = date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const photoSrc = photoPath
    ? photoPath.startsWith("http")
      ? photoPath
      : `${API_ORIGIN}${photoPath}`
    : null;

  return (
    <Link
      href={`/event/${id}`}
      className="block bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 no-underline"
    >
      {photoSrc && (
        <img
          src={photoSrc}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className={photoSrc ? "p-5 pt-3" : "p-5"}>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-accent-light text-accent">
          {label}
        </span>

        <h3 className="font-medium text-text text-base mb-1">{title}</h3>

        <p className="text-sm text-text-secondary mb-3">
          {formatted} &middot; {location} &middot; {currentPeople}/{maxPeople}{" "}
          чел.
          {price === 0 && " · бесплатно"}
          {price > 0 && ` · ${price} BYN`}
        </p>

        {participantsPreview && participantsPreview.length > 0 && (
          <div className="flex -space-x-1.5 mb-3">
            {participantsPreview.slice(0, 4).map((p, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-accent-light border-2 border-white flex items-center justify-center text-[10px] font-semibold text-accent"
              >
                {p.name[0]}
              </div>
            ))}
          </div>
        )}

        <div
          className={`w-full py-2.5 text-sm font-medium rounded-lg text-center transition-colors ${
            isJoined
              ? "bg-accent-light text-accent"
              : "bg-accent text-white hover:bg-accent-hover"
          }`}
        >
          {isJoined ? "Вы идёте" : "Иду \u2192"}
        </div>
      </div>
    </Link>
  );
}
