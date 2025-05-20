import { getAccessToken } from "../auth/fetch-users";

export async function getAllEnrolledStats() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/payments/all-stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data enroll ANJINGG:", res.statusText);
      throw new Error("Gagal memuat data enroll.");
    }

    const stats = await res.json();
    // console.log(stats)
    return stats;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data enroll:", error);
    throw error;
  }
}
