import { getAccessToken } from "../auth/fetch-users";



export async function getMyEnrollment() {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/enrollments/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data enrollment:", res.statusText);
      throw new Error("Gagal memuat data enrollment.");
    }

    const enrollment = await res.json();
    return enrollment.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data kenrollment:", error);
    throw error;
  }
}


export async function getisEnrolled(courseId: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/enrollments/${courseId}/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan status enrollment:", res.statusText);
      throw new Error("Gagal memuat status enrollment.");
    }

    const enrolled = await res.json();
    return enrolled.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil status kenrollment:", error);
    throw error;
  }
}

export async function getCourseAvailabity(courseId: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/payments/${courseId}/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan status enrollment:", res.statusText);
      throw new Error("Gagal memuat status enrollment.");
    }

    const enrolled = await res.json();
    return enrolled.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil status kenrollment:", error);
    throw error;
  }
}