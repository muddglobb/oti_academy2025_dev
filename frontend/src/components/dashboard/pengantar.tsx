import React from "react";
import EnrolledClass from "./enrolled-class";
import { Info } from "lucide-react";

const Pengantar = () => {
  return (
    <div>
      <p className="mb-1 text-neutral-50 text-sm">Class</p>

      <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6">
        <div className="lg:hidden">
          <div className="lg:col-span-1 mt-6 lg:mt-0 border-2 border-neutral-500 rounded-[20px] p-5 flex flex-col gap-3">
            <h1 className="font-bold font-lg pb-3 border-b-2 border-neutral-500">
              Pengantar
            </h1>

            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Kamu bisa daftar 2 kelas: 1 Intermediate dan 1 Entry atau 1
                Bundle
              </p>
            </div>
            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Setiap kelas dilengkapi video teaser untuk membantumu memahami
                materi sejak awal.
              </p>
            </div>
            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Semua materi dapat diakses dan diunduh sebanyak yang kamu mau
                hingga tanggal 21 July 2025.
              </p>
            </div>
          </div>
        </div>

        {/* Left Column */}
        <div className="lg:col-span-2">
          <EnrolledClass />
        </div>

        {/* Right Column */}
        <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0 border-2 border-neutral-500 rounded-[20px] p-5">
          <div className=" flex flex-col gap-3">
            <h1 className="font-bold font-lg pb-3 border-b-2 border-neutral-500">
              Pengantar
            </h1>

            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Kamu bisa daftar 2 kelas: 1 Intermediate dan 1 Entry atau 1
                Bundle
              </p>
            </div>
            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Setiap kelas dilengkapi video teaser untuk membantumu memahami
                materi sejak awal.
              </p>
            </div>
            <div className="flex border-2 border-neutral-500 rounded-[20px] p-[10px] gap-[10px]">
              <Info className="w-5 h-5 shrink-0" />
              <p>
                Semua materi dapat diakses dan diunduh sebanyak yang kamu mau
                hingga tanggal 21 July 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengantar;
