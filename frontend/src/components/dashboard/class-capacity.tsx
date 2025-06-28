import CapacityProgressBar from "./capacity-progress-bar";
import Link from "next/link";
import { cookies } from "next/headers";
import Alert from "./alert";
// import { useEffect, useState } from "react";

type ClassCapacityProps = {
  ClassName: string;
  ClassDesc: string;
  ClassLevel: string;
  CourseID: string;
  ClassSlug: string;
  Courses1: string;
  Courses2?: string;
};

type Enroll = {
  status: string;
  message: string;
  data: {
    isEnrolled: boolean;
  };
};

const ClassCapacity = async ({
  ClassName,
  ClassDesc,
  ClassLevel,
  CourseID,
  ClassSlug,
  Courses1,
  Courses2,
}: ClassCapacityProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.BASE_URL}/payments/${CourseID}/stats`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const apiData = await res.json();

  async function getEnroll(courseID: string) {
    const enrollRes = await fetch(
      `${process.env.BASE_URL}/enrollments/${courseID}/status`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return enrollRes;
  }

  const enrollRes = await getEnroll(CourseID);
  const enrollData = await enrollRes.json();

  // let enroll: Enroll[] = Array.isArray(enrollData.data) ? enrollData.data : [];

  const isEnrolled = enrollData.data?.isEnrolled;

  async function getSelfEnroll() {
    const selfEnrollRes = await fetch(
      `${process.env.BASE_URL}/enrollments/me`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return selfEnrollRes;
  }

  const selfEnrollRes = await getSelfEnroll();
  const selfEnrollData = await selfEnrollRes.json();

  const enrolledCourseID1 = selfEnrollData.data[0]?.courseId;
  const enrolledCourseID2 = selfEnrollData.data[1]?.courseId;
  const enrollmentCount = selfEnrollData.data?.length;

  async function getCourseLevel(CourseID: string) {
    const res = await fetch(`${process.env.BASE_URL}/courses/${CourseID}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  }

  const getEnrolledCourse = await getCourseLevel(enrolledCourseID1);
  const getEnrolledCourseData = await getEnrolledCourse.json();

  const enrolledCourseLevel = getEnrolledCourseData.data?.level;

  async function getPaymentStatus() {
    const res = await fetch(`${process.env.BASE_URL}/payments/my-payments`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res;
  }

  const paymentRes = await getPaymentStatus();
  const paymentData = await paymentRes.json();

  const paymentStatus =
    Array.isArray(paymentData.data) && paymentData.data.length > 0
      ? paymentData.data[0].status
      : undefined;
  const paymentDataLength = Array.isArray(paymentData.data)
    ? paymentData.data.length
    : 0;

  const enrolledClassType =
    Array.isArray(paymentData.data) && paymentData.data.length > 0
      ? paymentData.data[0].packageType
      : "";

  const enrolledClassType2 =
    Array.isArray(paymentData.data) && paymentData.data.length > 1
      ? paymentData.data[1].packageType
      : "";

  const enrolledCourse1 =
    Array.isArray(paymentData.data) && paymentData.data.length > 0
      ? paymentData.data[0].courseName
      : "";

  const enrolledCourse2 =
    Array.isArray(paymentData.data) && paymentData.data.length > 1
      ? paymentData.data[1].courseName
      : "";

  let enrolledPackage1 = "";
  let enrolledPackage2 = "";

  if (enrolledClassType === "BUNDLE") {
    enrolledPackage1 =
      Array.isArray(paymentData.data) && paymentData.data.length > 0
        ? paymentData.data[0].bundleCourses[0].title
        : "";

    enrolledPackage2 =
      Array.isArray(paymentData.data) && paymentData.data.length > 0
        ? paymentData.data[0].bundleCourses[1].title
        : "";
  }

  const EntryInterCount = apiData.data?.enrollments?.entryIntermediateCount;
  const BundleCount = apiData.data?.enrollments?.bundleCount;
  const EntryInterQuota = apiData.data?.quota?.entryIntermediateQuota;

  const nonBundleCount = EntryInterCount + BundleCount;

  const nonBundleQuota = EntryInterQuota + BundleCount;

  const currentCount =
    ClassLevel === "ENTRY"
      ? nonBundleCount ?? 0
      : ClassLevel === "INTERMEDIATE"
      ? nonBundleCount ?? 0
      : ClassLevel === "BUNDLE"
      ? apiData.data?.enrollments?.bundleCount ?? 0
      : 0;
  const capacity =
    ClassLevel === "ENTRY"
      ? nonBundleQuota ?? 1
      : ClassLevel === "INTERMEDIATE"
      ? nonBundleQuota ?? 1
      : ClassLevel === "BUNDLE"
      ? apiData.data?.quota?.bundleQuota ?? 1
      : 0;
  const percentage =
    capacity > 0 ? Math.round((currentCount / capacity) * 100) : 0;

  // console.log(enrolledCourseID2);

  // console.log(enrolledCourse2);

  const now = new Date();
  const targetDate = new Date("2025-06-29T23:59:00");

  return (
    <div className=" flex flex-col gap-[5px] ">
      <p className="self-start mb-[5px] text-neutral-50 text-sm">
        Class {"> "} {ClassName}
      </p>

      {ClassLevel === "BUNDLE" &&
        ((enrolledClassType === "BUNDLE" && isEnrolled === true) ||
          paymentDataLength < 1) && <Alert Desc="Alert Bundle" />}

      {enrolledClassType === "BUNDLE" &&
        paymentStatus === "PAID" &&
        (enrolledPackage1 === Courses1 || enrolledPackage2 === Courses1) && (
          <Alert Desc="Waiting For Approval" />
        )}

      {enrolledClassType !== "BUNDLE" &&
        paymentStatus === "PAID" &&
        (enrolledCourse1 === Courses1 || enrolledCourse2 === Courses1) && (
          <Alert Desc="Waiting For Approval" />
        )}

      {ClassLevel === "BUNDLE" &&
        (paymentStatus === "APPROVED" ||
          (paymentStatus === "PAID" &&
            enrolledPackage1 !== Courses1 &&
            enrolledPackage2 !== Courses1)) &&
        isEnrolled === false && <Alert Desc="Alert Same Class Level" />}

      {ClassLevel !== "BUNDLE" &&
        (paymentStatus === "APPROVED" ||
          (paymentStatus === "PAID" &&
            enrolledCourse1 !== Courses1 &&
            enrolledCourse2 !== Courses1)) &&
        (ClassLevel === enrolledClassType ||
          ClassLevel === enrolledClassType2) &&
        isEnrolled === false && <Alert Desc="Alert Same Class Level" />}
      <div
        className="border-sol border-2 border-neutral-500 rounded-[20px] p-5 flex flex-col gap-3"
        style={
          (enrolledClassType === "BUNDLE" &&
            paymentStatus === "PAID" &&
            (enrolledPackage1 === Courses1 || enrolledPackage2 === Courses1)) ||
          (enrolledClassType !== "BUNDLE" &&
            paymentStatus === "PAID" &&
            (enrolledCourse1 === Courses1 || enrolledCourse2 === Courses1))
            ? {
                backgroundColor: "transparent",
              }
            : {
                backgroundImage: "url('/images/class-capacity-background.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
        }
      >
        <div className="flex flex-row justify-between items-center">
          <p className="font-display font-bold text-lg sm:text-[26px]">
            {ClassName}
          </p>
          <div className="bg-primary-500 py-1 px-2 rounded-[6px] text-neutral-50 text-sm font-display">
            <p>{ClassLevel}</p>
          </div>
        </div>

        <p className="sm:text-lg text-xs">{ClassDesc}</p>
        <CapacityProgressBar
          currentCount={currentCount}
          capacity={capacity}
          percentage={percentage}
        />

        {ClassLevel === "ENTRY"
          ? isEnrolled === false &&
            now < targetDate &&
            enrolledClassType !== "BUNDLE" &&
            currentCount !== capacity &&
            paymentDataLength < 2 &&
            enrollmentCount < 2 &&
            enrolledClassType !== ClassLevel && (
              <Link
                href={`/payment/${ClassSlug}`}
                className="bg-primary-500 rounded-[8px] text-xs py-2 px-14.5 w-fit"
              >
                <p>Enroll Now</p>
              </Link>
            )
          : isEnrolled === false &&
            (paymentDataLength === 0 || ClassLevel !== "BUNDLE") &&
            enrolledClassType !== "BUNDLE" &&
            currentCount !== capacity &&
            paymentDataLength < 2 &&
            enrollmentCount < 2 &&
            enrolledClassType !== ClassLevel && (
              <Link
                href={`/payment/${ClassSlug}`}
                className="bg-primary-500 rounded-[8px] text-xs py-2 px-14.5 w-fit"
              >
                <p>Enroll Now</p>
              </Link>
            )}
      </div>
    </div>
  );
};

export default ClassCapacity;
