import { getCourses } from "@/lib/courses/fetch-courses";
import React from "react";

const ClassTracker = async () => {
  const courses = await getCourses();
  return (
    <div>
      <p>Tracker kelas</p>
      <div className="grid grid-cols-2 gap-4 w-100">
        {courses.data.map((course: any) => (
          <div key={course.id} className="">
            <p className="">{course.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassTracker;
