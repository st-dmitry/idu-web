const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// --- Enums ---

export enum Gender {
  NotSpecified = 0,
  Male = 1,
  Female = 2,
}

// --- Dictionaries ---

export interface CategoryResponse {
  id: number;
  name: string | null;
}

export interface CategoryGroupResponse {
  id: number;
  name: string | null;
  categories: CategoryResponse[] | null;
}

// --- Dev mock support ---

const USE_MOCKS =
  typeof window !== "undefined" && process.env.NODE_ENV === "development";

async function tryMock<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T | undefined> {
  if (!USE_MOCKS) return undefined;
  const { findMockHandler } = await import("./dev-mocks");
  const handler = findMockHandler(method, path);
  if (!handler) return undefined;
  // Simulate async
  await new Promise((r) => setTimeout(r, 150));
  return handler(path, body) as T;
}

// --- Request helpers ---

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const method = options?.method ?? "GET";
  const body = options?.body ? JSON.parse(options.body as string) : undefined;

  if (USE_MOCKS) {
    const mock = await tryMock<T>(method, path, body);
    if (mock !== undefined) return mock;
  }

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function requestVoid(
  path: string,
  options?: RequestInit
): Promise<void> {
  const method = options?.method ?? "GET";
  const body = options?.body ? JSON.parse(options.body as string) : undefined;

  if (USE_MOCKS) {
    const mock = await tryMock<unknown>(method, path, body);
    if (mock !== undefined || USE_MOCKS) {
      await tryMock(method, path, body);
      return;
    }
  }

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// --- Auth ---

export interface TelegramAuthRequest {
  telegramId: number;
  telegramUsername?: string | null;
  name: string;
  photoUrl?: string | null;
  hash: string;
  authDate: number;
}

export interface AuthResponse {
  token: string | null;
  userId: string;
  isNewUser: boolean;
}

export function authTelegram(data: TelegramAuthRequest): Promise<AuthResponse> {
  return request<AuthResponse>("/Auth/telegram", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// --- Dictionaries ---

export function getCategories(lang = "ru"): Promise<CategoryGroupResponse[]> {
  return request<CategoryGroupResponse[]>(`/Dictionaries/categories?lang=${lang}`);
}

export function getInterests(lang = "ru"): Promise<CategoryGroupResponse[]> {
  return request<CategoryGroupResponse[]>(`/Dictionaries/interests?lang=${lang}`);
}

// --- Events ---

export interface EventResponse {
  id: string;
  creatorUserId: string;
  creatorName: string | null;
  title: string | null;
  category: number;
  startTime: string;
  latitude: number;
  longitude: number;
  city: string | null;
  description: string | null;
  maxParticipants: number;
  currentParticipants: number;
  cost: number | null;
  isPublic: boolean;
  photoPath: string | null;
  telegramChatLink: string | null;
  likesCount: number;
  isLikedByMe: boolean;
  isJoinedByMe: boolean;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  category?: number;
  startTime: string;
  latitude?: number;
  longitude?: number;
  city?: string | null;
  description?: string | null;
  maxParticipants?: number;
  cost?: number | null;
  isPublic?: boolean;
}

export interface EventsFilter {
  category?: number;
  city?: string;
  from?: string;
  to?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  isFree?: boolean;
  page?: number;
  pageSize?: number;
}

export function getEvents(
  params?: EventsFilter,
  token?: string
): Promise<EventResponse[]> {
  const sp = new URLSearchParams();
  if (params?.category !== undefined) sp.set("Category", String(params.category));
  if (params?.city) sp.set("City", params.city);
  if (params?.from) sp.set("From", params.from);
  if (params?.to) sp.set("To", params.to);
  if (params?.latitude !== undefined) sp.set("Latitude", String(params.latitude));
  if (params?.longitude !== undefined) sp.set("Longitude", String(params.longitude));
  if (params?.radiusKm !== undefined) sp.set("RadiusKm", String(params.radiusKm));
  if (params?.isFree !== undefined) sp.set("IsFree", String(params.isFree));
  if (params?.page !== undefined) sp.set("Page", String(params.page));
  if (params?.pageSize !== undefined) sp.set("PageSize", String(params.pageSize));
  const qs = sp.toString();
  return request<EventResponse[]>(`/Events${qs ? `?${qs}` : ""}`, {
    headers: token ? authHeaders(token) : {},
  });
}

export function getEvent(id: string, token?: string): Promise<EventResponse> {
  return request<EventResponse>(`/Events/${id}`, {
    headers: token ? authHeaders(token) : {},
  });
}

export function createEvent(
  data: CreateEventRequest,
  token: string
): Promise<EventResponse> {
  return request<EventResponse>("/Events", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function uploadEventPhoto(
  eventId: string,
  file: File,
  token: string
): Promise<string> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    return URL.createObjectURL(file);
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/Events/${eventId}/photo`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function joinEvent(eventId: string, token: string): Promise<void> {
  return requestVoid(`/Events/${eventId}/join`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export function leaveEvent(eventId: string, token: string): Promise<void> {
  return requestVoid(`/Events/${eventId}/join`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function likeEvent(eventId: string, token: string): Promise<void> {
  return requestVoid(`/Events/${eventId}/like`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export function unlikeEvent(eventId: string, token: string): Promise<void> {
  return requestVoid(`/Events/${eventId}/like`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function getMyCreatedEvents(token: string): Promise<EventResponse[]> {
  return request<EventResponse[]>("/Events/my/created", {
    headers: authHeaders(token),
  });
}

export function getMyJoinedEvents(token: string): Promise<EventResponse[]> {
  return request<EventResponse[]>("/Events/my/joined", {
    headers: authHeaders(token),
  });
}

export function getRecommendations(token: string): Promise<EventResponse[]> {
  return request<EventResponse[]>("/Events/recommendations", {
    headers: authHeaders(token),
  });
}

// --- Users ---

export interface UserProfileResponse {
  id: string;
  name: string | null;
  gender: Gender;
  birthDate: string;
  photoPath: string | null;
  bio: string | null;
  rating: number;
  reviewCount: number;
  interests: number[] | null;
}

export interface UpdateProfileRequest {
  name: string;
  gender?: Gender;
  birthDate?: string;
  bio?: string | null;
  interests?: number[] | null;
}

export function getMe(token: string): Promise<UserProfileResponse> {
  return request<UserProfileResponse>("/Users/me", {
    headers: authHeaders(token),
  });
}

export function updateProfile(
  data: UpdateProfileRequest,
  token: string
): Promise<void> {
  return requestVoid("/Users/me", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function uploadProfilePhoto(
  file: File,
  token: string
): Promise<string> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));
    return URL.createObjectURL(file);
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/Users/me/photo`, {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export function getUser(userId: string, token?: string): Promise<UserProfileResponse> {
  return request<UserProfileResponse>(`/Users/${userId}`, {
    headers: token ? authHeaders(token) : {},
  });
}

export function addFavorite(userId: string, token: string): Promise<void> {
  return requestVoid(`/Users/${userId}/favorite`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export function removeFavorite(userId: string, token: string): Promise<void> {
  return requestVoid(`/Users/${userId}/favorite`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function getFavorites(token: string): Promise<UserProfileResponse[]> {
  return request<UserProfileResponse[]>("/Users/me/favorites", {
    headers: authHeaders(token),
  });
}

// --- Reviews ---

export interface UserReviewResponse {
  id: string;
  fromUserId: string;
  fromUserName: string | null;
  rating: number;
  text: string | null;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating?: number;
  text?: string | null;
}

export function getUserReviews(userId: string): Promise<UserReviewResponse[]> {
  return request<UserReviewResponse[]>(`/users/${userId}/reviews`);
}

export function createReview(
  userId: string,
  data: CreateReviewRequest,
  token: string
): Promise<UserReviewResponse> {
  return request<UserReviewResponse>(`/users/${userId}/reviews`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}
