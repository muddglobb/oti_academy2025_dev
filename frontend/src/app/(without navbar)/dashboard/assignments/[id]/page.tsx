import getAssignment from "@/lib/assignment/fetch-assignment";
import React from "react";
import { Lock } from "lucide-react";
import { getCoursesById } from "@/lib/courses/fetch-courses";
import SubmitAss from "@/components/assignments/submit-ass";
import getSubmission from "@/lib/submissions/fetch-submission";
import Link from "next/link";

const Assignments = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = decodeURIComponent((await params).id);
  const courses = await getCoursesById(id);
  const response = await getAssignment(id);
  const data = response.data;
  console.log(data);
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-40 gap-2">
        <div className="flex gap-3 items-center">
          <Lock className="" />
          <p className="font-bold text-2xl">Halaman Ini Masih Terkunci</p>
        </div>
        <p className="text-center">Kelas kamu belum memiliki tugas</p>
      </div>
    );
  }
  const now = new Date();
  const dueDate = new Date(data[0].dueDate);
  // const dueDate = new Date("2025-07-11T23:59:00.000+07:00");

  const show = now < dueDate;
  // console.log("akokadwo", show)

  let assLink = "";
  const res = await getSubmission();
  const submission = res.data;
  let subId = "";
  // console.log(submission[0].assignmentId);
  for (let i = 0; i < submission.length; i++) {
    if (submission[i].assignment.courseId === id) {
      assLink = submission[i].fileUrl;
      subId = submission[i].id;
    }
  }
  // console.log("dkeokde", assLink)
  return (
    <div className="m-14 border-2 border-neutral-400 rounded-xl p-6">
      <p className="font-bold">Final Project {courses.data.title}</p>
      <p className="font-bold text-2xl mt-3">{data[0].title}</p>
      <p
        dangerouslySetInnerHTML={{
          __html: data[0].description.replace(/\n/g, "<br />"),
        }}
      />
      <Link href={data[0].resourceUrl} target="_blank">
        <p className="font-bold hover:underline">
          Resource URL: {data[0].resourceUrl}
        </p>
      </Link>
      {/* {assLink} */}
      <p className="mt-3">Kumpulkan tugas sebelum: {data[0].dueDateWib}</p>
      <SubmitAss id={data[0].id} assLink={assLink} subId={subId} show={show}/>
    </div>
  );
};

export default Assignments;
