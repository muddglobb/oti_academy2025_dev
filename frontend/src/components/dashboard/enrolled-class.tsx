import React from "react";
import { getMyPayments } from "@/lib/payment/fetch-payment";
import { Clock } from "lucide-react";
import KelasKosong from "./kelass-kosong";
import MenyiapkanKelas from "./menyiapkan-kelas";
import ApprovedClass from "./approved-class";
import { getShortDescByTitle } from "@/lib/course-props/course-props";

export type PaidBundle = {
  id: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: string; // Bisa dijadikan union type kalau nilainya terbatas, misal: 'UMUM' | 'DIKE'
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: string; // Bisa jadi: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
};

export type MemberGroup = {
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  userEmail: string;
  role: string;
}
export type CreaterGroup = {
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  userEmail: string;
  role: string;
}
export type Group = {
  isGroupPayment: boolean;
  totalMembers: number;
  groupStatus: string;
  allMemberCourses: MemberGroup[];
  createrInfo: CreaterGroup;
}

export type EnrollmentDetail = {
  id: string;
  userId: string;
  packageId: string;
  courseId: string;
  type: string; // 'UMUM' | 'DIKE'
  proofLink: string;
  status: string; // 'PAID' | 'PENDING' | dll
  createdAt: string;
  updatedAt: string;
  packageName: string;
  packageType: string; // 'INTERMEDIATE' | 'BUNDLE' | 'BEGINNER'
  price: number;
  courseName: string;
  user: User;
  course: Course;
  bundleCourses: null | Course[];
  enrollmentStatus: boolean;
  paymentDate: string;
  groupPayemntDetails?: Group;
};

type PropsType = {
  check: string;
};
const EnrolledClass = async ({ check }: PropsType) => {
  const payments = await getMyPayments();

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
            payments[0].bundleCourses.map((paidClass: PaidBundle) => (
              <div key={paidClass.id}>
                <MenyiapkanKelas
                  title={paidClass.title}
                  // description={paidClass.description}
                  description={getShortDescByTitle(paidClass.title)}
                />
              </div>
            ))}

          {payments[0]?.packageType === "BUNDLE" &&
            payments[0].status === "APPROVED" &&
            payments[0].bundleCourses.map((paidClass: PaidBundle) => (
              <div key={paidClass.id}>
                <ApprovedClass
                  title={paidClass.title}
                  // description={paidClass.description}
                  description={getShortDescByTitle(paidClass.title)}
                />
              </div>
            ))}

          {payments[0]?.packageType !== "BUNDLE" && (
            <>
              {payments.map((paidClass: EnrollmentDetail) => (
                <div key={paidClass.id}>
                  {paidClass.status === "PAID" ? (
                    <MenyiapkanKelas
                      title={paidClass.course.title}
                      // description={paidClass.course.description}
                      description={getShortDescByTitle(paidClass.course.title)}
                    />
                  ) : (
                    <ApprovedClass
                      title={paidClass.course.title}
                      // description={paidClass.course.description}
                      description={getShortDescByTitle(paidClass.course.title)}
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {payments.length === 0 && (
            <>
              <KelasKosong
                title="Hmm, daftar kelasmu masih kosong nih!"
                desc="Gimana kalau kita isi sekarang? Ada banyak kelas keren yang bisa kamu pilih!"
                check={check}
              />
              <KelasKosong
                title="Satu lagi biar komplit!"
                desc="Masih ada slot kosong nih, isi sekarang biar makin mantap!"
                check={check}
              />
            </>
          )}

          {payments.length === 1 && payments[0]?.packageType !== "BUNDLE" && (
            <KelasKosong
              title="Hmm, daftar kelasmu masih kosong nih!"
              desc="Gimana kalau kita isi sekarang? Ada banyak kelas keren yang bisa kamu pilih!"
              check={check}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledClass;
