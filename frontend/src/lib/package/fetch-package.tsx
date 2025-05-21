'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchPackage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";
  
  if (!accessToken) {
    redirect("/login");
  }

  try {
    const res = await fetch("http://localhost:8000/packages", {
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
        const res = await fetch("http://localhost:8000/courses", {
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