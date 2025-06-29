import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMyPayments } from "@/lib/payment/fetch-payment";
import TolakPopUp from "@/components/payment/tolak-popup";
import Konfirmasi from "@/components/payment/konfirmasi";
import ChooseClassGroup from "@/components/group-payment/choose-class";
import { getUsers } from "@/lib/auth/fetch-users";
import { getCourses } from "@/lib/courses/fetch-courses";

type Session = {
  id: string;
  title: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  level: "INTERMEDIATE" | "BUNDLE";
  quota: number;
  entryQuota: number;
  bundleQuota: number;
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
};
type CourseSummary = {
  id: string;
  title: string;
};
const GroupPayment = async () => {
  const payments = await getMyPayments();
  const users = await getUsers();
  const response = await getCourses();
  const courses = response.data;

  const intermediateCourses: CourseSummary[] = courses
    .filter((course: Course) => course.level === "INTERMEDIATE")
    .map((course: Course) => ({
      id: course.id,
      title: course.title,
    }));

  let checkBundle = "NO";
  let checkEntry = "NO";
  let checkIntermediate = "NO";

  if (payments[0]?.packageType == "BUNDLE") checkBundle = "YES";
  else {
    for (let i = 0; i < 2; i++) {
      if (payments[i]?.packageType == "ENTRY") checkEntry = "YES";
      else if (payments[i]?.packageType == "INTERMEDIATE")
        checkIntermediate = "YES";
    }
  }

  return (
    <div className="text-neutral-50 py-3 xl:py-10 px-4 xl:px-14 flex flex-col gap-4">
      <Link
        href="/dashboard/dashboard"
        className="flex gap-2 bg-primary-900 text-sm font-bold px-3.5 py-2 rounded-[8px] w-fit self-start"
      >
        <ArrowLeft size={20} color="white" />
        <p className="text-white">Kembali</p>
      </Link>

      {checkBundle == "YES" && <TolakPopUp type="Bundle" isGroup={true} />}
      {checkBundle == "NO" && checkIntermediate == "YES" && (
        <TolakPopUp type="Intermediate" isGroup={true} />
      )}

      <ChooseClassGroup
        myEmail={users.data.email}
        CourseOptions={intermediateCourses}
      />
    </div>
  );
};

export default GroupPayment;
