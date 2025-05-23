import React from 'react'
import { getMyPayments } from "@/lib/payment/fetch-payment";
import { Clock } from "lucide-react";

const EnrolledClass = async () => {
  const payments = await getMyPayments();
  return (
    <div className="col-span-2 border-2 border-neutral-500 rounded-[20px]">
        <div className="rounded-[20px] p-6 ">
          <h3 className="text-lg font-medium mb-4">Enrolled Class</h3>
          <div className="flex items-center mb-3 pb-3 border-b-2 border-neutral-500">
            <Clock size={16} className="mr-2 text-gray-400" />
            <p className="text-sm text-gray-300">
              Kamu bisa daftar 2 kelas: 1 Intermediate dan 1 Entry atau 1 Bundle
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {payments.map((paidClass: any) => (
              <div
                key={paidClass.id}
                // className="border-3 border-neutral-500 rounded-[20px] h-35 p-4"
              >
                {paidClass.status === "PAID" && (
                  <div className="bg-neutral-500 border-3 border-neutral-500 rounded-[20px] h-35 p-4">
                    <div className="w-5/6">

                    <div className="flex gap-2 items-center mb-2">
                      <div className="w-4 h-4 bg-primary-100 rounded-full"></div>
                      <p className="text-primary-100">
                        Menyiapkan kelas untuk kamu!
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{paidClass.course.title}</p>
                      <p className="text-[12px]">{paidClass.course.description}</p>
                      {/* <p>{paidClass.status}</p> */}
                    </div>
                    </div>
                  </div>
                )}

                {/* PAID atau APPROVED */}
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default EnrolledClass