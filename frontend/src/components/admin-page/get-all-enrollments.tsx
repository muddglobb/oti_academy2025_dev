import React from "react";
import { getAllEnrollment } from "@/lib/payment/fetch-payment";

const GetAllEnrollments = async () => {
  const data = await getAllEnrollment();
  console.log(data)
  // console.log("DATA ENROLLMENTS", data.length);
  return (
    <div className="bg-neutral-50 p-5 rounded-[20px]">
      <p className="text-lg font-bold pb-3 border-b-2">Data semua pendaftar</p>
      <div className="mt-3">
        {data.map((item: any) => (
          <div key={item.id}>
            <p className="text-lg font-bold pb-3 border-b-2">{item.userId}</p>
            <p className="text-md font-bold pb-3 border-b-2">
              {item.userEmail}
            </p>
          </div>
        ))}

        {data.length === 0 && (
          <div className="">
            <p>GA ADA YG DAFTAR</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllEnrollments;
