export const dynamic = "force-dynamic";
import React from "react";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourses } from "@/lib/courses/fetch-courses";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type CourseData = {
  id: string;
  title: string;
  description: string;
  quota: number;
  entryQuota: number;
  bundleQuota: number;
  level: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
  createdAt: string;
  updatedAt: string;
  // sessions: CourseSession[];
};
const Assignments = async () => {
  try {
    await requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      redirect("/login");
    }
    redirect("/");
  }

  const responses = await getCourses();
  const courses = responses.data;
  return (
    <div className="py-[30px] px-14 min-h-screen">
      <p className="mb-1">Assignment</p>
      <div className="grid grid-cols-2 gap-6">
        {courses.map((item: CourseData) => (
          <div
            key={item.id}
            className="bg-neutral-50 rounded-[20px] p-5 flex justify-between"
          >
            <div className="text-[18px] font-bold">{item.title}</div>
            <Link href={`/admin-page/assignment-admin-page/${item.id}`}>
              <ArrowUpRight className="h-6 w-6 shrink-0" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
