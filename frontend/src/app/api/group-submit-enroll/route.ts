// File: app/api/group-submit-enroll/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";


export async function POST(req: NextRequest) {
  try {
    // Ambil access token dari cookies
    const cookieStore = cookies() as unknown as ReadonlyRequestCookies;
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: No access token" },
        { status: 401 }
      );
    }

    // Ambil body dari request
    const body = await req.json();
    const { packageId, creatorCourseId, members, proofLink } = body;

    // Validasi sederhana
    if (!packageId || !creatorCourseId || !members || !proofLink) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Kirim ke backend utama
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/group-payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        packageId,
        creatorCourseId,
        members,
        proofLink,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data?.message || "Something went wrong" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Group submit enroll error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
