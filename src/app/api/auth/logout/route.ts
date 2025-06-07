import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.headers.set(
    "Set-Cookie",
    [
      "access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
      "refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
    ].join(", ")
  );

  return response;
}
