import React from "react";
import Link from "next/link";

const KelasKosong = () => {
  return (
    <div className=" border-3 border-neutral-500 rounded-[20px] h-35 flex">
      <div className="w-5/6 p-4 flex flex-col justify-between">
        <div>
          <p className="text-sm">Hmm, daftar kelasmu masih kosong nih!</p>
          <p className="text-[12px]">
            Gimana kalau kita isi sekarang? Ada banyak kelas keren yang bisa
            kamu pilih!
          </p>
        </div>

        <div>
          <Link href="/dashboard/class-dashboard">
            <button className="px-3 py-2 bg-primary-500 font-bold text-[12px] rounded-sm">
              Eksplor Sekarang
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KelasKosong;
