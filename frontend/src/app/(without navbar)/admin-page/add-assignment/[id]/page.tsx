import React from "react";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import getAssignment from "@/lib/assignment/fetch-assignment";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddAssignmentForm from "@/components/admin-page/add-assignment-form";

const AddAssignment = async ({
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
  return (
    <div className="py-[42px] px-14">
      <Link href={`/admin-page/assignment-admin-page/${id}`}>
        <button className="flex gap-2 px-3 py-2 bg-neutral-400 rounded-[8px] mb-4 cursor-pointer">
          <ArrowLeft />
          <p>Kembali</p>
        </button>
      </Link>
      <p className="mb-1">
        Assignment {">"} {course.data.title} {">"} Final Project
      </p>
      {responses.data.length === 0 && <AddAssignmentForm courseId={id} />}
    </div>
  );
};

export default AddAssignment;
