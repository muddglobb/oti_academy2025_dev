import { ArrowUpRight } from "lucide-react";
import React from "react";
import Link from "next/link";

const AjakTeman = () => {
  return (
    <div className="bg-primary-800 rounded-[20px] p-5 mb-6 border-2 border-neutral-500 flex flex-col gap-3">
      <p className="text-[22px] font-bold">
        Ajak Teman, Dapat Potongan{" "}
        <span className="text-error-300">10%</span>!
      </p>
      <p className="text-justify">
        Sekarang beli kelas intermediate bisa <strong>lebih hemat</strong>! Ajak
        temanmu dan dapatkan potongan{" "}
        <span className="text-error-300 font-bold">10%.</span>{" "}
        Cukup beli{" "}
        <span className="text-error-300 font-bold">
          dan mengajak 1 teman,
        </span>{" "}
        kalian
        <strong>bebas pilih</strong>{" "}
        <span className="text-error-300 font-bold">satu topik</span>{" "}
        <strong>yang berbeda</strong> sesuai minat masing-masing.
      </p>
      <div className="self-end">
        <Link href={"/group-payment"}>
          <button className="flex items-center gap-2 bg-primary-400 px-3 py-2 rounded-[8px] cursor-pointer">
            <p>Beli Sekarang</p>
            <ArrowUpRight />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AjakTeman;
