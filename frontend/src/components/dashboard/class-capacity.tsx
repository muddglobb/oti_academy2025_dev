import CapacityProgressBar from "./capacity-progress-bar";
import Link from "next/link";
import { cookies } from "next/headers";
// import { useEffect, useState } from "react";

type ClassCapacityProps = {
  ClassName: string;
  ClassDesc: string;
  ClassLevel: string;
  CourseID: string;
};

const ClassCapacity = async ({
  ClassName,
  ClassDesc,
  ClassLevel,
  CourseID,
}: ClassCapacityProps) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const res = await fetch(`http://localhost:8000/payments/${CourseID}/stats`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const apiData = await res.json();

  const currentCount = apiData.data?.enrollments?.entryIntermediateCount ?? 0;
  const capacity = apiData.data?.quota?.entryIntermediateQuota ?? 1;
  const percentage = apiData.data?.percentageFilled ?? 0;

  return (
    <div className="flex flex-col gap-[5px] ">
      <p className="self-start mb-0 text-neutral-50 text-sm">
        Class {"> "} {ClassName}
      </p>
      <div
        className="w-270 h-58 border-sol border-2 border-neutral-500 rounded-[20px] p-5 flex flex-col gap-3"
        style={{
          backgroundImage: "url('/images/background-class-capacity.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-row justify-between items-center">
          <p className="font-display font-bold text-[26px]">{ClassName}</p>
          <div className="bg-primary-500 py-1 px-2 rounded-[6px] text-neutral-50 text-sm font-display">
            <p>{ClassLevel}</p>
          </div>
        </div>

        <p>{ClassDesc}</p>
        <CapacityProgressBar
          currentCount={currentCount}
          capacity={capacity}
          percentage={percentage}
        />
        <Link
          href={"/dashboard/class-dashboard"}
          className="bg-primary-500 rounded-[8px] text-xs py-2 px-14.5 w-fit"
        >
          <p>Enroll Now</p>
        </Link>
      </div>
    </div>
  );
};

export default ClassCapacity;
