import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  getFirstTeacher,
  getImageByTitle,
  getSecTeacher,
  getShortDescByTitle,
  getSlugByTitle,
} from "@/lib/course-props/course-props";
import CourseCard from "./course-card";

const getBundleImage = (name: string): string => {
  switch (name) {
    case "Bundle Python + Data Science & Artificial Intelligence":
      return "/images/class-profile/hako.jpg";
    case "Bundle Graphic Design + UI/UX":
      return "/logo.jpeg";
    case "Bundle Fundamental Cyber Security + Cyber Security":
      return "/images/class-profile/hako.jpg";
    case "Bundle Web Development + Software Engineering":
      return "/images/class-profile/hako.jpg";
    default:
      return "/images/course-placeholder.jpg";
  }
};

type getBundleMentorPicType = {
  TA: string;
  mentor: string;
};


type CourseType = {
  packageId: string;
  courseId: string;
  title: string;
  description: string;
  level: "ENTRY" | "INTERMEDIATE";
};

type PackageType = {
  id: string;
  name: string;
  type: "ENTRY" | "INTERMEDIATE" | "BUNDLE";
  price: number;
  createdAt: string;
  updatedAt: string;
  courses: CourseType[];
};

export default function BundleCard({
  pkg,
  course,
}: {
  pkg: PackageType;
  course: CourseType;
}) {
  return (
    <>
      {pkg.type === "BUNDLE" && (
        <div key={pkg.id}>
          <CourseCard
            slug={getSlugByTitle(pkg.name)}
            image={getImageByTitle(pkg.name)}
            // title={pkg.name.replace(/^Bundle\s+/i, "")}
            title={pkg.name}
            description={getShortDescByTitle(pkg.name)}
            firstTeacher={getFirstTeacher(pkg.name)}
            secTeacher={getSecTeacher(pkg.name)}
          />
        </div>
      )}
    </>
  );
}
