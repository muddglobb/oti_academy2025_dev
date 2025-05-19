import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAccessToken = async () => {
  const cookieStore = cookies();
  return cookieStore.get("access_token")?.value || "";
  // return cookies().get("access_token")?.value ?? "";
};

export async function getUsers() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      redirect("/login"); // ⬅️ langsung redirect jika tidak ada access token
    }
    const res = await fetch(`${process.env.BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Tidak perlu credentials di server
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data pengguna:", res.statusText);
      throw new Error("Gagal memuat data pengguna.");
    }

    const users = await res.json();
    return users;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pengguna:", error);
    throw error;
  }
}
