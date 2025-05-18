import { getAccessToken } from "../auth/fetch-users";



export async function getCourses() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch("http://localhost:8000/courses", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data kelas:", res.statusText);
      throw new Error("Gagal memuat data kelas.");
    }

    const users = await res.json();
    return users;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data kelas:", error);
    throw error;
  }
}
