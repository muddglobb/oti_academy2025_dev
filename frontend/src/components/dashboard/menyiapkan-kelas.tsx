import React from "react";
import Image from "next/image";

const MenyiapkanKelas = ({ icon, title, description }: any) => {
  return (
    <div className="bg-neutral-500 border-3 border-neutral-500 rounded-[20px] h-35 flex">
      <Image
        src={icon || "/person-placeholder.jpeg"}
        alt="class-icon"
        className="rounded-l-[16px]"
        width={140}
        height={140}
      />
      <div className="w-5/6 p-4">
        <div className="flex gap-2 items-center mb-2">
          <div className="w-4 h-4 bg-primary-100 rounded-full"></div>
          <p className="text-primary-100">Menyiapkan kelas untuk kamu!</p>
        </div>
        <div>
          <p className="font-bold text-sm">{title}</p>
          <p className="text-[12px]">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MenyiapkanKelas;
