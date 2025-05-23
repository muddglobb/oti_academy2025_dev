// app/api/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  console.log("POST ENROLL");
  const body = await req.json();
  // console.log("BODY", body);
  const accessToken = await cookies().get("access_token")?.value;
  // console.log("ACCESS TOKEN", accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Tidak ada akses token." },
      { status: 401 }
    );
    // console.log("Tidak ada akses token.");
  } 
  // else{
  //   console.log("Akses token ditemukan:", accessToken);
  // }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const result = await res.json();
  return NextResponse.json(result);
}
