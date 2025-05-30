import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";

type MobileBottomBarProps = {
  CourseID: string;
  ClassLevel: string;
  ClassSlug: string;
};

const MobileBottomBar = async ({
  CourseID,
  ClassLevel,
  ClassSlug,
}: MobileBottomBarProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(`http://localhost:8000/payments/${CourseID}/stats`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const apiData = await res.json();

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
  return (
    <div
      className="border-t-2 border-neutral-500 sticky w-full bottom-0 z-20 flex flex-row justify-between py-6 px-6 rounded-t-[10px]"
      style={{
        backgroundImage: "url('/images/class-capacity-background.png')",
        backgroundSize: "cover",
      }}
    >
      <div>
        <p className="text-lg font-bold">
          {currentCount}/{capacity}
        </p>
      </div>
      <Link href={`/payment/${ClassSlug}`}>
        <div className="rounded-[8px] text-xs py-2 px-19 bg-primary-500">
          Enroll Now
        </div>
      </Link>
    </div>
  );
};

export default MobileBottomBar;
