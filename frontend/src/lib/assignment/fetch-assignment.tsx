import { getAccessToken } from "../auth/fetch-users";

export async function getAssignment (courseId: string){
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${process.env.BASE_URL}/assignments/course/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      console.error("Gagal mendapatkan data tugas:", res.statusText);
      throw new Error("Gagal memuat data tugas.");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data tugas:", error);
    throw error;
  }
};


export async function getSubmission (courseId: string){
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(
      `${process.env.BASE_URL}/submissions/course/${courseId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!res.ok) {
      console.error("Gagal mendapatkan data submission:", res.statusText);
      throw new Error("Gagal memuat data submission.");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data submission:", error);
    throw error;
  }
};