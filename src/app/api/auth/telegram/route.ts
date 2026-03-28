import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyTelegramAuth, type TelegramUser } from "@/lib/telegram";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const data: TelegramUser = await req.json();

  if (!BOT_TOKEN || !JWT_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!verifyTelegramAuth(data, BOT_TOKEN)) {
    return NextResponse.json(
      { error: "Invalid Telegram auth data" },
      { status: 401 }
    );
  }

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

  const token = jwt.sign(
    {
      sub: String(data.id),
      name,
      username: data.username,
      photo_url: data.photo_url,
    },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  const user = {
    id: String(data.id),
    name,
    avatar_url: data.photo_url,
    username: data.username,
  };

  return NextResponse.json({ token, user });
}
