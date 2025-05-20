import React from "react";
import { getAllEnrolledStats } from "@/lib/payment/fetch-payment";

const ClassTracker = async () => {
  const stats = await getAllEnrolledStats();
  return (
    <div className="bg-neutral-50 w-full p-5 rounded-[20px]">
      <p className="text-lg font-bold pb-3 border-b-2">Tracker kelas</p>
      <div className="grid grid-cols-2 gap-5 text-md mt-3">
        {stats.data.map((stat: any) => (
          <div key={stat.id} className="">
            <p className="">{stat.title}</p>

            <div className="flex items-center">
              <p className="w-20">
                {stat.enrollment.total} / {stat.quota.total}
              </p>
              <div className="bg-neutral-200 w-full h-2 rounded-sm">
                <div
                  className="bg-neutral-400 h-2 rounded-sm"
                  style={{ width: `${stat.enrollment.total}%` }}
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
