"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  authTelegram,
  getMe,
  type UserProfileResponse,
  type TelegramAuthRequest,
} from "./api";
import { MOCK_USER } from "./dev-mocks";

const IS_DEV = process.env.NODE_ENV === "development";

interface AuthContextValue {
  user: UserProfileResponse | null;
  token: string | null;
  isLoading: boolean;
  isNewUser: boolean;
  loginWithTelegram: () => void;
  devLogin: (() => void) | null;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearNewUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "idu_token";
const USER_KEY = "idu_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const saveSession = useCallback(
    (newToken: string, newUser: UserProfileResponse) => {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    },
    []
  );

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const profile = await getMe(token);
    setUser(profile);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  }, [token]);

  const clearNewUser = useCallback(() => {
    setIsNewUser(false);
  }, []);

  // Listen for Telegram OAuth callback message
  useEffect(() => {
    async function handleMessage(event: MessageEvent) {
      if (event.origin !== "https://oauth.telegram.org") return;

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (!data?.id || !data?.hash) return;

        const telegramData: TelegramAuthRequest = {
          telegramId: data.id,
          telegramUsername: data.username ?? null,
          name: [data.first_name, data.last_name].filter(Boolean).join(" "),
          photoUrl: data.photo_url ?? null,
          hash: data.hash,
          authDate: data.auth_date,
        };

        const authResponse = await authTelegram(telegramData);

        if (!authResponse.token) {
          throw new Error("No token received");
        }

        if (authResponse.isNewUser) {
          setIsNewUser(true);
        }

        const profile = await getMe(authResponse.token);
        saveSession(authResponse.token, profile);
      } catch (err) {
        console.error("Auth failed:", err);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [saveSession]);

  const loginWithTelegram = useCallback(() => {
    const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
    if (!botId) {
      console.error("NEXT_PUBLIC_TELEGRAM_BOT_ID is not set");
      return;
    }

    const width = 550;
    const height = 470;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&request_access=write`,
      "telegram-login",
      `width=${width},height=${height},left=${left},top=${top}`
    );
  }, []);

  const devLogin = useCallback(() => {
    if (!IS_DEV) return;
    setIsNewUser(true);
    saveSession("dev-stub-token", MOCK_USER);
  }, [saveSession]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsNewUser(false);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isNewUser,
        loginWithTelegram,
        devLogin: IS_DEV ? devLogin : null,
        logout,
        refreshUser,
        clearNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
