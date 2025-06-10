// app/api/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/fetch-users";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const accessToken = await getAccessToken();

    const apiRes = await fetch(`${process.env.BASE_URL}/payments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!apiRes.ok) {
      return NextResponse.json({ error: "Gagal menghapus pembayaran." }, { status: apiRes.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Terjadi kesalahan." }, { status: 500 });
  }
}
