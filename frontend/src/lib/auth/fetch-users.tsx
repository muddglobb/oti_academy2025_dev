

import { cookies } from "next/headers";

export const getAccessToken = async () => {
  // const cookieStore = cookies();
  // return cookieStore.get("access_token")?.value || "";
  return cookies().get("access_token")?.value ?? ""
};


export async function getUsers() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch("http://localhost:8000/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Tidak perlu credentials di server
    })

    if (!res.ok) {
      console.error("Gagal mendapatkan data pengguna:", res.statusText)
      throw new Error("Gagal memuat data pengguna.")
    }

    const users = await res.json()
    return users
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pengguna:", error)
    throw error
  }
}