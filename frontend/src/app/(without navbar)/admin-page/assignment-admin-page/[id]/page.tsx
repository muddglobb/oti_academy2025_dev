import {getAssignment} from "@/lib/assignment/fetch-assignment";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import { ArrowLeft, Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import ShowSubmission from "@/components/admin-page/show-submission";

const AssignmentPages = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  try {
    await requireAdmin();
  } catch (err) {
    if ((err as Error).message === "NO_TOKEN") {
      redirect("/login");
    }
    redirect("/");
  }
  const id = decodeURIComponent((await params).id);
  const responses = await getAssignment(id);
  const course = await getCoursesById(id);
  // console.log(course);
  return (
    <div className="py-[42px] px-14 min-h-screen">
      <Link href={"/admin-page/assignment-admin-page"}>
        <button className="flex gap-2 px-3 py-2 bg-neutral-400 rounded-[8px] mb-4 cursor-pointer">
          <ArrowLeft />
          <p>Kembali</p>
        </button>
      </Link>
      <p className="mb-1">
        Assignment {">"} {course.data.title}
      </p>
      <div className="grid grid-cols-3 gap-6">
        {responses.data.length === 0 && (
          <div className="bg-neutral-50 rounded-[20px] flex justify-between p-5">
            <p className="text-[18px] font-bold max-w-41">
              Woi ini belum ada Final Project
            </p>
            <Link href={`/admin-page/add-assignment/${id}`}>
              <Plus className="h-6 w-6 shrink-0" />
            </Link>
          </div>
        )}
        {/* <div className="bg-neutral-50 rounded-[20px] p-5">Submitted</div>
        <div className="bg-neutral-50 rounded-[20px] p-5">
          Haven't Submitted
        </div> */}
      </div>
      <ShowSubmission courseId={id}/>
    </div>
  );
};

export default AssignmentPages;
