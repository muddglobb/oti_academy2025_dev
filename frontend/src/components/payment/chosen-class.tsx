import React from "react";
import { CircleAlert } from "lucide-react";
import { getAllPackage } from "@/lib/package/fetch-package";
import { getCoursesById } from "@/lib/courses/fetch-courses";

const ChosenClass = async ({
  courseId,
  packageId,
}: {
  courseId: any;
  packageId: any;
}) => {
  const packageData = await getAllPackage();
  console.log(packageData);
  let name = null;
  if (courseId === null || courseId === undefined) {
    name = packageData.data.find((item: any) => item.id === packageId)?.name;
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
