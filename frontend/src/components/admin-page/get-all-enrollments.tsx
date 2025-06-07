import React from "react";
import { getAllEnrollment } from "@/lib/payment/fetch-payment";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import GetAllEnrollmentsClient from "./get-all-enrollments-client";

export type EnrollmentPayment = {
  id: string;
  userId: string;
  packageId: string;
  courseId: string;
  type: "UMUM" | "MAHASISWA" | string;
  proofLink: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
  updatedAt: string;
  packageName: string;
  packageType: "ENTRY" | "INTERMEDIATE" | "BUNDLE" | string;
  price: number;
  courseName: string;
  userName: string;
  userEmail: string;
  userType: "UMUM" | "MAHASISWA" | string;
};


const GetAllEnrollments = async () => {
  const data: EnrollmentPayment[] = await getAllEnrollment();

  // Ambil semua detail course berdasarkan courseId dari masing-masing item
  const enrichedData = await Promise.all(
    data.map(async (item: EnrollmentPayment) => {
      if (item.packageType === "BUNDLE") {
        return {
          ...item,
          courseTitle: item.packageName || "Tanpa nama paket",
        };
      }

      const kelas = await getCoursesById(item.courseId);
      return {
        ...item,
        courseTitle: kelas?.data?.title || "Tidak diketahui",
      };
    })
  );


  return <GetAllEnrollmentsClient data={enrichedData} />;
};

export default GetAllEnrollments;
