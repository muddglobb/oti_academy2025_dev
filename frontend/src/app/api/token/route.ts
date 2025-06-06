// app/api/token/route.ts   (App Router)
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function GET(request: Request) {
  // const token = request.cookies.get("access_token")?.value ?? "";
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  const token = cookieStore.get("access_token")?.value ?? "";
  return NextResponse.json({ token });
}
