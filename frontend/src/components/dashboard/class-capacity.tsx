import CapacityProgressBar from "./capacity-progress-bar";
import Link from "next/link";
import { cookies } from "next/headers";
// import { useEffect, useState } from "react";

type ClassCapacityProps = {
  ClassName: string;
  ClassDesc: string;
  ClassLevel: string;
  CourseID: string;
  ClassSlug: string;
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

  let enroll: Enroll[] = Array.isArray(enrollData.data) ? enrollData.data : [];

  const isEnrolled = enrollData.data?.isEnrolled;

  const currentCount =
    ClassLevel === "ENTRY"
      ? apiData.data?.enrollments?.entryIntermediateCount ?? 0
      : ClassLevel === "INTERMEDIATE"
      ? apiData.data?.enrollments?.entryIntermediateCount ?? 0
      : ClassLevel === "BUNDLE"
      ? apiData.data?.enrollments?.bundleCount ?? 0
      : 0;
  const capacity =
    ClassLevel === "ENTRY"
      ? apiData.data?.quota?.entryIntermediateQuota ?? 1
      : ClassLevel === "INTERMEDIATE"
      ? apiData.data?.quota?.entryIntermediateQuota ?? 1
      : ClassLevel === "BUNDLE"
      ? apiData.data?.quota?.bundleQuota ?? 1
      : 0;
  const percentage =
    capacity > 0 ? Math.round((currentCount / capacity) * 100) : 0;

  return (
    <div className=" flex flex-col gap-[5px] ">
      <p className="self-start mb-[5px] text-neutral-50 text-sm">
        Class {"> "} {ClassName}
      </p>
      <div
        className="border-sol border-2 border-neutral-500 rounded-[20px] p-5 flex flex-col gap-3"
        style={{
          backgroundImage: "url('/images/class-capacity-background.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
        {isEnrolled === false && (
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
