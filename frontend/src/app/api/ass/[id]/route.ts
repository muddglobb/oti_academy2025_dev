import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
  const body = await req.json();
  // const assignmentId = params.id;
  const assignmentId = decodeURIComponent((await params).id);

  const cookieStore = (await cookies()) as unknown as ReadonlyRequestCookies;
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Tidak ada akses token." },
      { status: 401 }
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/submissions/${assignmentId}`,
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
