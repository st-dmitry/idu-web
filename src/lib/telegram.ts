import crypto from "crypto";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Verify the data received from Telegram Login Widget.
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramAuth(
  data: TelegramUser,
  botToken: string
): boolean {
  const { hash, ...rest } = data;

  // 1. Build the check string: key=value pairs sorted alphabetically, joined by \n
  const checkString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key as keyof typeof rest]}`)
    .join("\n");

  // 2. Secret key = SHA-256 of bot token
  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  // 3. HMAC-SHA-256 of check string using secret key
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  if (hmac !== hash) return false;

  // 4. Check auth_date is not too old (allow 1 hour)
  const now = Math.floor(Date.now() / 1000);
  if (now - data.auth_date > 3600) return false;

  return true;
}

/**
 * Build the Telegram OAuth URL for popup-based login.
 */
export function getTelegramOAuthUrl(botId: string, redirectUrl: string): string {
  const origin = new URL(redirectUrl).origin;
  return `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&request_access=write&return_to=${encodeURIComponent(redirectUrl)}`;
}
