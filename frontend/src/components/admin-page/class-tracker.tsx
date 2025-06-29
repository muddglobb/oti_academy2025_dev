import React from "react";
import { getAllEnrolledStats } from "@/lib/payment/fetch-payment";

export type CourseEnrollmentStats = {
  id: string;
  title: string;
  level: "ENTRY" | "INTERMEDIATE" | "BUNDLE" | string;
  quota: {
    total: number;
    entryQuota: number;
    bundleQuota: number;
  };
  enrollment: {
    total: number;
    entryIntermediateCount: number;
    bundleCount: number;
  };
  pendingPayment: {
    total: number;
    entryIntermediateCount: number;
    bundleCount: number;
  };
  totalPayment: {
    total: number;
    entryIntermediateCount: number;
    bundleCount: number;
  };
  remaining: {
    entryIntermediate: number;
    bundle: number;
  };
};

export type EnrolledStatsResponse = {
  status: "success" | "error" | string;
  message: string;
  data: CourseEnrollmentStats[];
};

const ClassTracker = async () => {
  const stats: EnrolledStatsResponse = await getAllEnrolledStats();
  return (
    <div className="bg-neutral-50 w-full p-5 rounded-[20px]">
      <p className="text-lg font-bold pb-3 border-b-2">Tracker kelas</p>
      <div className="grid grid-cols-2 gap-5 text-md mt-3">
        {stats.data.map((stat) => (
          <div key={stat.id} className="">
            <p className="">{stat.title}</p>

            <div className="flex items-center">
              <p className="w-20">
                {stat.enrollment.total} / {stat.quota.total}
              </p>
              <div className="bg-neutral-200 w-full h-2 rounded-sm">
                <div
                  className="bg-neutral-400 h-2 rounded-sm"
                  style={{ width: `${(stat.enrollment.total / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassTracker;
