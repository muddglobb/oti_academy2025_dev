// app/api/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const cookieStore = await cookies() as unknown as ReadonlyRequestCookies;
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Tidak ada access token." },
      { status: 401 }
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/assignments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const result = await res.json();
  return NextResponse.json(result);
}
