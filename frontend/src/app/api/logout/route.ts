import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  // void _req;
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    if (refreshToken) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
          // headers: {
          //   // "Content-Type": "application/json",
          //   Authorization: `Bearer ${accessToken}`,
          //   // ...(refreshToken && {
          //   //   Cookie: `refresh_token=${refreshToken}`,
          //   // }),
          // },
          // headers: {
          //   Cookie: `refresh_token=${refreshToken}`, 
          // }
          body: JSON.stringify({ refreshToken }),
        });
      } catch (err) {
        console.error("Gagal logout ke backend:", err);
      }
    }
    // alert("berhasil logout");
    return NextResponse.json({ message: "Logout success" });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
