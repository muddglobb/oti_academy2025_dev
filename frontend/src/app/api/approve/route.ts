// app/api/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const paymentId = body.paymentId;

  if (!paymentId) {
    return NextResponse.json({ error: "Payment ID tidak ditemukan." }, { status: 400 });
  }

  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Tidak ada access token." }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/${paymentId}/approve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const result = await res.json();
  return NextResponse.json(result);
}
