"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/fetch-users";

export async function fetchPackage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  if (!accessToken) {
    redirect("/login");
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/packages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch packages");
    }

    const packageData = await res.json();
    return packageData.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
}

export async function fetchCourse() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  if (!accessToken) {
    redirect("/login");
  }

  try {
    const res = await fetch(`${process.env.BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }

    const courseData = await res.json();
    return courseData.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export async function getAllPackage() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      redirect("/login"); // ⬅️ langsung redirect jika tidak ada access token
    }
    const res = await fetch(`${process.env.BASE_URL}/packages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapatkan data package:", res.statusText);
      throw new Error("Gagal memuat data package.");
    }

    const packages = await res.json();
    return packages;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data package:", error);
    throw error;
  }
}

export async function getPackageById(courseId: string) {
  try {
    const accessToken = await getAccessToken();
    const res = await fetch(`${process.env.BASE_URL}/packages/${courseId}`, {
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
    return users.data;
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data kelas:", error);
    throw error;
  }
}