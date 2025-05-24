import React from "react";
import { getMyPayments } from "@/lib/payment/fetch-payment";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const EnrolledClass = async () => {
  const payments = await getMyPayments();

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
          {payments[0].packageType === "BUNDLE" &&
            payments[0].status === "PAID" &&
            payments[0].bundleCourses.map((paidClass: any) => (
              <div key={paidClass.id}>
                <div className="bg-neutral-500 border-3 border-neutral-500 rounded-[20px] h-35 flex">
                  <Image
                    src="/person-placeholder.jpeg"
                    alt="class-icon"
                    className="rounded-l-[16px]"
                    width={140}
                    height={140}
                  />
                  <div className="w-5/6 p-4">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="w-4 h-4 bg-primary-100 rounded-full"></div>
                      <p className="text-primary-100">
                        Menyiapkan kelas untuk kamu!
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{paidClass.title}</p>
                      <p className="text-[12px]">{paidClass.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {payments[0].packageType === "BUNDLE" &&
            payments[0].status === "APPROVED" &&
            payments[0].bundleCourses.map((paidClass: any) => (
              <div key={paidClass.id}>
                <div className="bg-neutral-50 border-3 border-neutral-500 rounded-[20px] h-35 flex">
                  <Image
                    src="/person-placeholder.jpeg"
                    alt="class-icon"
                    className="rounded-l-[16px]"
                    width={140}
                    height={140}
                  />
                  <div className="w-5/6 p-4">
                    <div className="flex gap-2 items-center mb-2">
                      <div className="w-4 h-4 bg-[#095C37] rounded-full"></div>
                      <p className="text-[#095C37]">On going</p>
                    </div>
                    <div className="text-neutral-900">
                      <p className="font-bold text-sm">{paidClass.title}</p>
                      <p className="text-[12px]">{paidClass.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {payments[0].packageType !== "BUNDLE" && (
            <>
              {payments.map((paidClass: any) => (
                <div key={paidClass.id}>
                  {paidClass.status === "PAID" ? (
                    <div className="bg-neutral-500 border-3 border-neutral-500 rounded-[20px] h-35 flex">
                      <Image
                        src="/person-placeholder.jpeg"
                        alt="class-icon"
                        className="rounded-l-[16px]"
                        width={140}
                        height={140}
                      ></Image>
                      <div className="w-5/6 p-4">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="w-4 h-4 bg-primary-100 rounded-full"></div>
                          <p className="text-primary-100">
                            Menyiapkan kelas untuk kamu!
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {paidClass.course.title}
                          </p>
                          <p className="text-[12px]">
                            {paidClass.course.description}
                          </p>
                          {/* <p>{paidClass.status}</p> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-neutral-50 border-3 border-neutral-500 rounded-[20px] h-35 text-neutral-900 flex">
                      <Image
                        src="/person-placeholder.jpeg"
                        alt="class-icon"
                        className="rounded-l-[16px]"
                        width={140}
                        height={140}
                      ></Image>
                      <div className="w-5/6 p-4">
                        <div className="flex gap-2 items-center mb-2">
                          <div className="w-4 h-4 bg-[#095C37] rounded-full"></div>
                          <p className="text-[#095C37]">On going</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {paidClass.course.title}
                          </p>
                          <p className="text-[12px]">
                            {paidClass.course.description}
                          </p>
                          {/* <p>{paidClass.status}</p> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PAID atau APPROVED */}
                </div>
              ))}
            </>
          )}

          {payments.length === 0 && (
            <>
              <div className=" border-3 border-neutral-500 rounded-[20px] h-35 flex">
                <div className="w-5/6 p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-sm">
                      Hmm, daftar kelasmu masih kosong nih!
                    </p>
                    <p className="text-[12px]">
                      Gimana kalau kita isi sekarang? Ada banyak kelas keren
                      yang bisa kamu pilih!
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

              <div className=" border-3 border-neutral-500 rounded-[20px] h-35 flex">
                <div className="w-5/6 p-4 flex flex-col justify-between">
                  <div>
                    <p className="text-sm">
                      Hmm, daftar kelasmu masih kosong nih!
                    </p>
                    <p className="text-[12px]">
                      Gimana kalau kita isi sekarang? Ada banyak kelas keren
                      yang bisa kamu pilih!
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledClass;
