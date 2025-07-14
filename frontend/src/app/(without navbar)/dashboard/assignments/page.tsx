export const dynamic = "force-dynamic";
import React from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { getMyEnrollment } from "@/lib/enrollment/fetch-enrollment";
import Image from "next/image";
import { getImageByTitle } from "@/lib/course-props/course-props";
import Link from "next/link";
export type Courses = {
  title: string;
};
const page = async () => {
  const response = await getMyEnrollment();
  // console.log(response);
  const courses: { courseId: string; title: string }[] = [];

  response.forEach((item: { courseId: string; course: Courses }) => {
    courses.push({ courseId: item.courseId, title: item.course.title });
  });
  // console.log(courses)
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-40 gap-2">
        <div className="flex gap-3 items-center">
          <Lock className="" />
          <p className="font-bold text-2xl">Halaman Ini Masih Terkunci</p>
        </div>
        <p className="text-center">
          Kamu belum memiliki kelas atau kelas kamu belum memiliki tugas
        </p>
      </div>
    );
  }
  return (
    <div className="p-14 grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((item) => (
        <div
          key={item.courseId}
          className="w-full shrink-0 bg-neutral-50 rounded-[20px]"
        >
          <Image
            src={getImageByTitle(item.title)}
            alt={item.title}
            width={200}
            height={200}
            className="w-full object-contain rounded-t-[21px]"
          />
          <div className="p-4 flex justify-between items-center">
            <p className="font-bold text-black">{item.title}</p>
            <Link href={`/dashboard/assignments/${item.courseId}`}>
              <button className="p-2 bg-primary-500 rounded-xl cursor-pointer">
                <ArrowUpRight />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;

{
  /* <div className="flex flex-col items-center justify-center h-full mt-40 gap-2">
      <div className="flex gap-3 items-center">
        <Lock className="" />
        <p className="font-bold text-2xl">Halaman Ini Masih Terkunci</p>
      </div>
      <p className="text-center">
        Kamu belum bisa mengakses konten ini. Pastikan kamu sudah menyelesaikan
        langkah atau tugas sebelumnya, ya!
      </p>
    </div> */
}
