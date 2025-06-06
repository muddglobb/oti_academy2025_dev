import { getMyEnrollment } from "@/lib/enrollment/fetch-enrollment";
import React from "react";
import Link from "next/link";

const GrupWa = async () => {
  const myEnroll = await getMyEnrollment();
  const totalEnrollments = myEnroll.length;

  console.log("MELL", myEnroll);
  if (totalEnrollments === 0) {
    return (
      <div className="border-2 border-neutral-500 rounded-[20px] p-5">
        <h3 className="font-medium mb-3 pb-3 border-b-2 border-neutral-500">
          WhatsApp Group
        </h3>
        <p className="text-sm text-gray-300">
          Grup WA ini khusus untuk yang sudah terdaftar, jadi jangan lupa
          daftar!
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-neutral-500 rounded-[20px] p-5">
      <h3 className="font-medium mb-3 pb-3 border-b-2 border-neutral-500">
        Yuk, Gabung WhatsApp Group
      </h3>
      <p className="text-sm text-gray-300">
        Stay connected & update bareng temansekelas!
      </p>
      <div className="flex justify-end">
        <Link href={"https://chat.whatsapp.com/D9HMjfFoJj30gbjLCy5FVg"}>
          <button className="text-sm bg-primary-500 py-2 px-3 rounded-sm cursor-pointer">
            Join Community
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GrupWa;
