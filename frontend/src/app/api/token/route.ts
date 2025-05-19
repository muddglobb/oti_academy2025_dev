// app/api/token/route.ts   (App Router)
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.cookies.get("access_token")?.value ?? "";
  return NextResponse.json({ token });
}
