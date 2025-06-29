import React from "react";
import { getAllEnrollment } from "@/lib/payment/fetch-payment";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import GetAllEnrollmentsClient from "./get-all-enrollments-client";

export type AllMemberCourseProps = {
  courseId: string;
  courseName: string;
  role: string;
  userEmail: string;
  userName: string;
};
export type CreatorCourseProps = {
  courseId: string;
  courseName: string;
  role: string;
  userEmail: string;
  userId: string;
  userName: string;
};
export type GroupPaymentInfoProps = {
  allMemberCourse: AllMemberCourseProps[];
  creatorCourse: CreatorCourseProps[];
  groupStatus: string;
  isGroupPayment: boolean;
  totalMembers: number;
};
export type MemberCoursesProps = {
  courseId: string;
  courseName: string;
  role: string;
  userEmail: string;
  userId: string;
  userName: string;
};
export type EnrollmentPayment = {
  id: string;
  userId: string;
  packageId: string;
  courseId: string;
  type: string;
  proofLink: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  packageName: string;
  packageType: string;
  price: number;
  courseName: string;
  userName: string;
  userEmail: string;
  userType: string;
  userPhone: string;
  courseTitle: string; // properti tambahan yang tidak ada di response awal
  discountedAmount: number;
  groupPaymentInfo: GroupPaymentInfoProps[];
  groupStatus: string;
  invitedEmail: string[];
  invitedUserIds: string[];
  isGroupPayment: boolean;
  memberCourses: MemberCoursesProps[];
  originalAmount: number;
  totalParticipants: number;
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

  console.log(enrichedData);


  return <GetAllEnrollmentsClient data={enrichedData} />;
};

export default GetAllEnrollments;
