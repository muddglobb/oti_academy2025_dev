import React from "react";
import Link from "next/link";

type PropsType = {
  title: string;
  desc: string;
  check: string;
};
const KelasKosong = ({ title, desc, check }: PropsType) => {
  return (
    <div className=" border-3 border-neutral-500 rounded-[20px] flex">
      {/* <div className="sm:w-30 aspect-square bg-neutral-500 text-wrap rounded-l-[17px]"></div> */}
      <div className="w-full p-4 flex flex-col justify-between">
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-[12px]">{desc}</p>
        </div>

        {check == "NO" && (
          <div>
            <Link href="/dashboard/class-dashboard">
              <button className="mt-3 px-3 py-2 bg-primary-500 font-bold text-[12px] rounded-sm cursor-pointer">
                Eksplor Sekarang
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelasKosong;
