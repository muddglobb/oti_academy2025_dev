import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  void _req;
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    if (refreshToken || accessToken) {
      try {
        await fetch(`${process.env.AUTH_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && {
              Authorization: `Bearer ${accessToken}`,
            }),
            // ...(refreshToken && {
            //   Cookie: `refresh_token=${refreshToken}`,
            // }),
          },
          body: JSON.stringify({
            ...(refreshToken && { refreshToken }),
          }),
          credentials: "include",
        });
      } catch (err) {
        console.error("Gagal logout ke backend:", err);
      }
    }

    return NextResponse.json({ message: "Logout success" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
