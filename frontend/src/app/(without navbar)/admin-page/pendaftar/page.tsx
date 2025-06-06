import React from "react";
import GetAllEnrollments from "@/components/admin-page/get-all-enrollments";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const Pendaftar = () => {
  return (
    <div className="px-14 py-10 min-h-screen">
      <Link href={"/admin-page"}>
        <button className="flex gap-2 py-2 px-3 bg-neutral-400 rounded-md mb-4 cursor-pointer">
          <ArrowLeft />
          <p>Kembali</p>
        </button>
      </Link>
      <p className="text-sm mb-1">Home {">"} Pendaftaran</p>
      <GetAllEnrollments />
    </div>
  );
};

export default Pendaftar;
