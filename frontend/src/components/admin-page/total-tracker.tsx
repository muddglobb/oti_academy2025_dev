import {
  getAllEnrolledStats,
} from "@/lib/payment/fetch-payment";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const TotalTracker = async () => {
  const statsData = await getAllEnrolledStats();
  const { total: totalPendaftar, approved } = statsData.meta.paymentCounts;
  
  return (
    <div className="h-full flex flex-col gap-7">
      <div className="h-1/2 bg-neutral-50 p-5 rounded-[20px] flex justify-between">
        <div>
          <p className="text-4xl font-bold">{totalPendaftar}</p>
          <p className="text-lg">Pendaftar</p>
        </div>
        <Link href={"/admin-page/pendaftar"}>
          <ArrowUpRight className="cursor-pointer"/>
        </Link>
      </div>
      <div className="h-1/2 bg-neutral-50 p-5 rounded-[20px]">
        <p className="text-4xl font-bold">{approved}</p>
        <p className="text-lg">Approved</p>
      </div>
    </div>
  );
};

export default TotalTracker;