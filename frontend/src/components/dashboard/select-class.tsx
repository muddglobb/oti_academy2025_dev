import React from "react";
import { getCourses } from "@/lib/courses/fetch-courses";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AllClassSlider from "./all-class-slider";
import Link from "next/link";

const SelectClass = async () => {
  const courses = await getCourses();
  console.log("Data kelas:", courses);
  return (
    <div className="mt-9">
      <div className="flex justify-between">
        <p>Rekomendasi Kelas</p>
        <div>
          <Link href="/dashboard/class-dashboard">
            <p>View All Classes</p>
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <AllClassSlider data={courses.data} />
      </div>
    </div>
  );
};

export default SelectClass;
