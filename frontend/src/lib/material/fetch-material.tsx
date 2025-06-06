import { getAccessToken } from "../auth/fetch-users";



export async function getMaterials({courseId}: {courseId: string}) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/materials/course/${courseId}/public`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data material kelas:", res.statusText);
      throw new Error("Gagal memuat data material kelas.");
    }

    const users = await res.json();
    return users;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data material kelas:", error);
    throw error;
  }
}