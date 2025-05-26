import React from "react";
import { getMyPayments } from "@/lib/payment/fetch-payment";
import { Clock } from "lucide-react";
import KelasKosong from "./kelass-kosong";
import MenyiapkanKelas from "./menyiapkan-kelas";
import ApprovedClass from "./approved-class";

const EnrolledClass = async () => {
  const payments = await getMyPayments();
  const now = new Date();
  // const targetDate = new Date("2025-05-28T13:52:14.495Z");
  // console.log(targetDate > now); // true jika targetDate sudah lewat

  // console.log("Payments", payments.length);
  console.log("Payments", payments[0]);
  return (
    <div className="border-2 border-neutral-500 rounded-[20px]">
      <div className="rounded-[20px] p-6 ">
        <h3 className="text-lg font-medium mb-4">Enrolled Class</h3>
        <div className="flex items-center mb-3 pb-3 border-b-2 border-neutral-500">
          <Clock size={16} className="mr-2 text-gray-400" />
          <p className="text-sm text-gray-300">
            Kamu bisa daftar 2 kelas: 1 Intermediate dan 1 Entry atau 1 Bundle
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {payments[0]?.packageType === "BUNDLE" &&
            payments[0].status === "PAID" &&
            payments[0].bundleCourses.map((paidClass: any) => (
              <div key={paidClass.id}>
                <MenyiapkanKelas
                  icon={"/person-placeholder.jpeg"}
                  title={paidClass.title}
                  description={paidClass.description}
                />
              </div>
            ))}

          {payments[0]?.packageType === "BUNDLE" &&
            payments[0].status === "APPROVED" &&
            payments[0].bundleCourses.map((paidClass: any) => (
              <div key={paidClass.id}>
                <ApprovedClass
                  icon={"/person-placeholder.jpeg"}
                  title={paidClass.title}
                  description={paidClass.description}
                />
              </div>
            ))}

          {payments[0]?.packageType !== "BUNDLE" && (
            <>
              {payments.map((paidClass: any) => (
                <div key={paidClass.id}>
                  {paidClass.status === "PAID" ? (
                    <MenyiapkanKelas
                      icon={"/person-placeholder.jpeg"}
                      title={paidClass.course.title}
                      description={paidClass.course.description}
                    />
                  ) : (
                    <ApprovedClass
                      icon={"/person-placeholder.jpeg"}
                      title={paidClass.course.title}
                      description={paidClass.course.description}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {payments.length === 0 && (
            <>
              <KelasKosong />
              <KelasKosong />
            </>
          )}

          {payments.length === 1 && payments[0]?.packageType !== "BUNDLE" && (
            <KelasKosong />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledClass;
