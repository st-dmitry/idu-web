import {
  Gender,
  type AuthResponse,
  type CategoryGroupResponse,
  type EventResponse,
  type UserProfileResponse,
  type UserReviewResponse,
} from "./api";

export const MOCK_USER: UserProfileResponse = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Dev User",
  gender: Gender.NotSpecified,
  birthDate: "2000-01-01",
  photoPath: null,
  bio: null,
  rating: 4.2,
  reviewCount: 7,
  interests: [100, 101, 110],
};

let mockUser = { ...MOCK_USER };

export const MOCK_EVENTS: EventResponse[] = [
  {
    id: "e1000000-0000-0000-0000-000000000001",
    creatorUserId: "00000000-0000-0000-0000-000000000002",
    creatorName: "Антон",
    title: "Пробежка в Лошицком парке",
    category: 100,
    startTime: "2026-04-05T08:00:00Z",
    latitude: 53.876,
    longitude: 27.58,
    city: "Минск",
    description:
      "Утренняя пробежка 5 км по парку. Темп комфортный, подходит для начинающих. После пробежки — кофе в ближайшей кофейне.",
    maxParticipants: 8,
    currentParticipants: 4,
    cost: null,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+abc123",
    likesCount: 12,
    isLikedByMe: false,
    isJoinedByMe: false,
    createdAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000002",
    creatorUserId: "00000000-0000-0000-0000-000000000003",
    creatorName: "Лена",
    title: "Настолки в антикафе",
    category: 500,
    startTime: "2026-04-06T18:00:00Z",
    latitude: 53.9,
    longitude: 27.56,
    city: "Минск",
    description:
      "Играем в Catan, Codenames и всё что найдём. Начинающие welcome!",
    maxParticipants: 6,
    currentParticipants: 3,
    cost: null,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+def456",
    likesCount: 8,
    isLikedByMe: true,
    isJoinedByMe: false,
    createdAt: "2026-03-21T14:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000003",
    creatorUserId: "00000000-0000-0000-0000-000000000004",
    creatorName: "Олег",
    title: "Поход на Нарочь",
    category: 110,
    startTime: "2026-04-12T07:00:00Z",
    latitude: 54.85,
    longitude: 26.75,
    city: "Нарочь",
    description:
      "Однодневный поход вокруг озера. Берём палатки, еду и хорошее настроение. Трансфер из Минска организуем.",
    maxParticipants: 12,
    currentParticipants: 6,
    cost: 15,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+ghi789",
    likesCount: 24,
    isLikedByMe: false,
    isJoinedByMe: true,
    createdAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000004",
    creatorUserId: "00000000-0000-0000-0000-000000000005",
    creatorName: "Арина",
    title: "Суши-вечер",
    category: 300,
    startTime: "2026-04-07T19:30:00Z",
    latitude: 53.91,
    longitude: 27.55,
    city: "Минск",
    description: "Собираемся в «Фугу» попробовать новое сезонное меню.",
    maxParticipants: 5,
    currentParticipants: 2,
    cost: 45,
    isPublic: true,
    photoPath: null,
    telegramChatLink: null,
    likesCount: 5,
    isLikedByMe: false,
    isJoinedByMe: false,
    createdAt: "2026-03-22T11:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000005",
    creatorUserId: "00000000-0000-0000-0000-000000000006",
    creatorName: "Денис",
    title: "Велопрогулка вдоль Свислочи",
    category: 100,
    startTime: "2026-04-08T10:00:00Z",
    latitude: 53.9,
    longitude: 27.56,
    city: "Минск",
    description:
      "Неспешная велопрогулка вдоль реки. Маршрут ~20 км, темп спокойный.",
    maxParticipants: 10,
    currentParticipants: 5,
    cost: null,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+jkl012",
    likesCount: 15,
    isLikedByMe: true,
    isJoinedByMe: true,
    createdAt: "2026-03-19T16:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000006",
    creatorUserId: "00000000-0000-0000-0000-000000000007",
    creatorName: "Алина",
    title: "Йога в парке Горького",
    category: 101,
    startTime: "2026-04-09T07:30:00Z",
    latitude: 53.9,
    longitude: 27.59,
    city: "Минск",
    description: "Утренняя йога на свежем воздухе. Коврики берите свои.",
    maxParticipants: 15,
    currentParticipants: 7,
    cost: 5,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+mno345",
    likesCount: 18,
    isLikedByMe: false,
    isJoinedByMe: false,
    createdAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000007",
    creatorUserId: "00000000-0000-0000-0000-000000000008",
    creatorName: "Рома",
    title: "Концерт Molchat Doma",
    category: 200,
    startTime: "2026-04-15T20:00:00Z",
    latitude: 53.93,
    longitude: 27.6,
    city: "Минск",
    description: "Идём вместе на концерт. Есть лишний билет!",
    maxParticipants: 4,
    currentParticipants: 3,
    cost: 35,
    isPublic: true,
    photoPath: null,
    telegramChatLink: null,
    likesCount: 31,
    isLikedByMe: false,
    isJoinedByMe: false,
    createdAt: "2026-03-15T12:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000008",
    creatorUserId: "00000000-0000-0000-0000-000000000009",
    creatorName: "Глеб",
    title: "Кинопоказ «Бриллиантовая рука»",
    category: 600,
    startTime: "2026-04-10T19:00:00Z",
    latitude: 53.89,
    longitude: 27.54,
    city: "Минск",
    description: "Классика советского кино на большом экране.",
    maxParticipants: 6,
    currentParticipants: 2,
    cost: 10,
    isPublic: true,
    photoPath: null,
    telegramChatLink: null,
    likesCount: 9,
    isLikedByMe: false,
    isJoinedByMe: false,
    createdAt: "2026-03-23T15:00:00Z",
  },
  {
    id: "e1000000-0000-0000-0000-000000000009",
    creatorUserId: "00000000-0000-0000-0000-000000000010",
    creatorName: "Полина",
    title: "Мастер-класс по керамике",
    category: 700,
    startTime: "2026-04-11T15:00:00Z",
    latitude: 53.88,
    longitude: 27.53,
    city: "Минск",
    description:
      "Лепим из глины кружки и тарелки. Опыт не нужен, всему научат на месте.",
    maxParticipants: 8,
    currentParticipants: 4,
    cost: 30,
    isPublic: true,
    photoPath: null,
    telegramChatLink: "https://t.me/+pqr678",
    likesCount: 14,
    isLikedByMe: true,
    isJoinedByMe: false,
    createdAt: "2026-03-21T11:00:00Z",
  },
];

const MOCK_REVIEWS: UserReviewResponse[] = [
  {
    id: "r1000000-0000-0000-0000-000000000001",
    fromUserId: "00000000-0000-0000-0000-000000000003",
    fromUserName: "Лена",
    rating: 5,
    text: "Отличная компания!",
    createdAt: "2026-03-25T10:00:00Z",
  },
];

// Dev mock API handlers — keyed by "METHOD /path-pattern"
type MockHandler = (path: string, body?: unknown) => unknown;

const MOCK_CATEGORIES: CategoryGroupResponse[] = [
  {
    id: 0,
    name: "Спорт и активный отдых",
    categories: [
      { id: 100, name: "Бег" },
      { id: 101, name: "Йога" },
      { id: 102, name: "Велосипед" },
      { id: 103, name: "Плавание" },
      { id: 104, name: "Футбол" },
      { id: 105, name: "Баскетбол" },
      { id: 106, name: "Теннис" },
      { id: 107, name: "Волейбол" },
      { id: 108, name: "Фитнес" },
      { id: 109, name: "Единоборства" },
      { id: 110, name: "Походы" },
    ],
  },
  {
    id: 1,
    name: "Музыка и концерты",
    categories: [
      { id: 200, name: "Концерт" },
      { id: 201, name: "Джем-сешн" },
      { id: 202, name: "Караоке" },
      { id: 203, name: "Фестиваль" },
    ],
  },
  {
    id: 2,
    name: "Еда и напитки",
    categories: [
      { id: 300, name: "Ресторан" },
      { id: 301, name: "Кулинарный мастер-класс" },
      { id: 302, name: "Дегустация" },
      { id: 303, name: "Барный тур" },
    ],
  },
  {
    id: 3,
    name: "Образование и развитие",
    categories: [
      { id: 400, name: "Лекция" },
      { id: 401, name: "Мастер-класс" },
      { id: 402, name: "Воркшоп" },
      { id: 403, name: "Языковая практика" },
    ],
  },
  {
    id: 4,
    name: "Игры и развлечения",
    categories: [
      { id: 500, name: "Настольные игры" },
      { id: 501, name: "Квиз" },
      { id: 502, name: "Видеоигры" },
      { id: 503, name: "Квест" },
    ],
  },
  {
    id: 5,
    name: "Кино и театр",
    categories: [
      { id: 600, name: "Кино" },
      { id: 601, name: "Театр" },
      { id: 602, name: "Стендап" },
    ],
  },
  {
    id: 6,
    name: "Творчество",
    categories: [
      { id: 700, name: "Рисование" },
      { id: 701, name: "Керамика" },
      { id: 702, name: "Фотография" },
    ],
  },
];

const MOCK_INTERESTS: CategoryGroupResponse[] = [
  {
    id: 0,
    name: "Спорт",
    categories: [
      { id: 100, name: "Бег" },
      { id: 101, name: "Йога" },
      { id: 102, name: "Велосипед" },
      { id: 104, name: "Футбол" },
      { id: 108, name: "Фитнес" },
      { id: 110, name: "Походы" },
    ],
  },
  {
    id: 1,
    name: "Культура",
    categories: [
      { id: 200, name: "Концерты" },
      { id: 600, name: "Кино" },
      { id: 601, name: "Театр" },
      { id: 700, name: "Рисование" },
      { id: 702, name: "Фотография" },
    ],
  },
  {
    id: 2,
    name: "Еда и отдых",
    categories: [
      { id: 300, name: "Рестораны" },
      { id: 302, name: "Дегустации" },
      { id: 500, name: "Настольные игры" },
      { id: 501, name: "Квизы" },
    ],
  },
  {
    id: 3,
    name: "Образование",
    categories: [
      { id: 400, name: "Лекции" },
      { id: 402, name: "Воркшопы" },
      { id: 403, name: "Языковая практика" },
    ],
  },
];

const handlers: Record<string, MockHandler> = {
  "GET /Dictionaries/categories": () => MOCK_CATEGORIES,
  "GET /Dictionaries/interests": () => MOCK_INTERESTS,

  "POST /Auth/telegram": () => ({
    token: "dev-stub-token",
    userId: MOCK_USER.id,
    isNewUser: true,
  } satisfies AuthResponse),

  "GET /Users/me": () => ({ ...mockUser }),

  "PUT /Users/me": (_path, body) => {
    mockUser = { ...mockUser, ...(body as Partial<UserProfileResponse>) };
    return undefined;
  },

  "POST /Users/me/photo": () => "/dev/photo.jpg",

  "GET /Users/": (path) => {
    const id = path.split("/Users/")[1]?.split("/")[0];
    return {
      ...MOCK_USER,
      id,
      name: "Другой Юзер",
      bio: "Люблю бегать и играть в настолки",
      rating: 4.8,
      reviewCount: 12,
    } satisfies UserProfileResponse;
  },

  "GET /Events/my/created": () =>
    MOCK_EVENTS.filter(
      (e) => e.creatorUserId === MOCK_USER.id
    ),

  "GET /Events/my/joined": () =>
    MOCK_EVENTS.filter((e) => e.isJoinedByMe),

  "GET /Events/recommendations": () =>
    MOCK_EVENTS.slice(0, 5),

  "GET /Events/": (path) => {
    // Single event by ID
    const id = path.split("/Events/")[1]?.split("/")[0]?.split("?")[0];
    const event = MOCK_EVENTS.find((e) => e.id === id);
    return event ?? MOCK_EVENTS[0];
  },

  "GET /Events": () => MOCK_EVENTS,

  "POST /Events": (_path, body) => ({
    ...MOCK_EVENTS[0],
    id: crypto.randomUUID(),
    ...(body as object),
    creatorUserId: MOCK_USER.id,
    creatorName: mockUser.name,
    currentParticipants: 1,
    likesCount: 0,
    isLikedByMe: false,
    isJoinedByMe: true,
    createdAt: new Date().toISOString(),
  } satisfies EventResponse),

  "POST /join": () => undefined,
  "DELETE /join": () => undefined,
  "POST /like": () => undefined,
  "DELETE /like": () => undefined,
  "POST /favorite": () => undefined,
  "DELETE /favorite": () => undefined,

  "GET /Users/me/favorites": () => [
    {
      ...MOCK_USER,
      id: "00000000-0000-0000-0000-000000000003",
      name: "Лена",
      rating: 4.9,
    },
  ] satisfies UserProfileResponse[],

  "GET /reviews": () => MOCK_REVIEWS,

  "POST /reviews": (_path, body) => ({
    id: crypto.randomUUID(),
    fromUserId: MOCK_USER.id,
    fromUserName: mockUser.name,
    rating: (body as { rating?: number })?.rating ?? 5,
    text: (body as { text?: string })?.text ?? null,
    createdAt: new Date().toISOString(),
  } satisfies UserReviewResponse),
};

export function findMockHandler(
  method: string,
  path: string
): MockHandler | null {
  // Try exact match first
  const exactKey = `${method} ${path}`;
  if (handlers[exactKey]) return handlers[exactKey];

  // Try prefix match (for parameterized routes)
  for (const [key, handler] of Object.entries(handlers)) {
    const [keyMethod, keyPath] = key.split(" ", 2);
    if (keyMethod === method && path.startsWith(keyPath)) return handler;
  }

  // Try suffix match (for /join, /like, /favorite, /reviews on any resource)
  for (const [key, handler] of Object.entries(handlers)) {
    const [keyMethod, keyPath] = key.split(" ", 2);
    if (keyMethod === method && path.endsWith(keyPath)) return handler;
  }

  return null;
}
