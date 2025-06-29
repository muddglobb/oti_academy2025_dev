// app/api/group-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(req: NextRequest) {
  const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Tidak ada akses token." }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/group-payments/validate-emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses request." }, { status: 500 });
  }
}
