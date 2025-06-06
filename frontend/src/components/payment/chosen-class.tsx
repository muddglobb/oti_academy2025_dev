import React from "react";
import { CircleAlert } from "lucide-react";
import { getAllPackage } from "@/lib/package/fetch-package";
import { getCoursesById } from "@/lib/courses/fetch-courses";

export type CourseData = {
  packageId: string;
  courseId: string;
  title: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
};
export type PackageData = {
  id: string;
  name: string;
  type: "BEGINNER" | "INTERMEDIATE" | "BUNDLE"; // asumsi enum level
  price: number;
  createdAt: string;
  updatedAt: string;
  courses: CourseData[];
}
const ChosenClass = async ({
  courseId,
  packageId,
}: {
  courseId: string | null | undefined;
  packageId: string | null | undefined;
}) => {
  const packageData = await getAllPackage();
  console.log(packageData);
  let name = null;
  if (courseId === null || courseId === undefined) {
    name = packageData.data.find((item: PackageData) => item.id === packageId)?.name;
  }
  else{
    const courseData = await getCoursesById(courseId);
    name = courseData.data.title;
  }
  return (
    <div className="items-center justify-between border-3 border-neutral-500 rounded-xl p-4">
      <div className="w-full pb-3 mb-3 border-b-3 border-neutral-500">
        <p className="text-lg font-bold">Chosen Class</p>
        <div className="flex items-center gap-2">
          <CircleAlert />
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>

      <div className="h-50 w-full bg-neutral-50 text-neutral-900 rounded-md p-4">
        {name}
      </div>
    </div>
  );
};

export default ChosenClass;
