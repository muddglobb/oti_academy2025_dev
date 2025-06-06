import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFirstTeacher, getImageByTitle, getSecTeacher } from "@/lib/course-props/course-props";

const getTeacherPic = (title: string): string => {
    switch (title) {
        case "Basic Python":
            return "/images/teacher/faris.jpg";
        case "Graphic Design":
            return "/images/teacher/faris.jpg";
        case "Competitive Programming":
            return "/images/teacher/faris.jpg";
        case "Game Development":
            return "/images/teacher/faris.jpg";
        case "Web Development":
            return "/images/teacher/faris.jpg";
        case "Fundamental Cyber Security":
            return "/images/teacher/faris.jpg";
        // intermediate
        case "Software Engineering":
            return "/images/teacher/faris.jpg";
        case "Data Science & Artificial Intelligence":
            return "/images/teacher/faris.jpg";
        case "UI/UX":
            return "/images/teacher/faris.jpg";
        case "Cyber Security":
            return "/images/teacher/faris.jpg";
        default:
            return "/images/teacher/faris.jpg";
    }
};

const getMentorPic = (title: string): string => {
    switch (title) {
        // intermediate
        case "Software Engineering":
            return "/images/class-profile/hako.jpg";
        case "Data Science & Artificial Intelligence":
            return "/images/class-profile/hako.jpg";
        case "UI/UX":
            return "/images/class-profile/hako.jpg";
        case "Cyber Security":
            return "/images/class-profile/hako.jpg";
        default:
            return "/images/class-profile/hako.jpg"; 
    }
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


export default function PackageCard({ pkg }: { pkg: PackageType, course: CourseType }) {
    if (pkg.type === "BUNDLE") return;

function getSlugByTitle(title: string) {
  switch (title) {
    case "Web Development":
      return "web-development";
    case "Software Engineering":
      return "software-engineering";
    case "Data Science & Artificial Intelligence":
      return "data-science&artificial-intelligence";
    case "UI/UX":
      return "ui-ux";
    case "Cyber Security":
      return "cyber-security";
    case "Basic Python":
      return "basic-python";
    case "Competitive Programming":
      return "competitive-programming";
    case "Game Development":
      return "game-development";
    case "Fundamental Cyber Security":
      return "fundamental-cyber-security";
    case "Graphic Design":
      return "graphic-design";
    case "Bundle Web Development + Software Engineering":
      return "web-development+software-engineering";
    case "Bundle Python + Data Science & Artificial Intelligence":
      return "python+data-science&artificial-intelligence";
    case "Bundle Graphic Design + UI/UX":
      return "graphic-design+ui-ux";
    case "Bundle Fundamental Cyber Security + Cyber Security":
      return "fundamental-cyber-security+cyber-security";
    default:
      return null;
  }
}


  return (
    <div>
        <div className="flex flex-col border-2 border-neutral-500 rounded-[20px] p-5 my-10">
            <h1 className="font-bold text-[18px] border-b-2 border-neutral-500 pb-3">{pkg.type.charAt(0)+pkg.type.substring(1).toLowerCase()} Class</h1>
            <div className="grid gap-5 grid-cols-1 xl:grid-cols-2 pt-4">                
                {pkg.type === "ENTRY" && 
                    pkg.courses.map((course) => (
                    <div
                        key={course.courseId}
                        className="flex flex-col border-2 rounded-[12px] border-neutral-500 bg-white w-full"
                    >
                        <Link href={`/dashboard/class-dashboard/${getSlugByTitle(course.title)}`}>
                        <div>
                            <div className="flex flex-row">
                            <Image
                                src={getImageByTitle(course.title)}
                                alt={course.title}
                                width={165}
                                height={165}
                                className="rounded-l-[10px]"
                            />

                                <div className="flex flex-col mx-5 my-4 justify-between w-full">
                                    <div>
                                        <div className="flex flex-row justify-between items-center">
                                            <h2 className="text-[14px] font-bold text-neutral-900">{course.title}</h2>
                                                <div className="bg-primary-500 rounded-[5px] self-start">
                                                    {/* <Link href={`/dashboard/class-dashboard/${pkg.id}`}> */}
                                                    {/* <Link href={`/dashboard/class-dashboard/${getSlugByTitle(course.title)}`}> */}
                                                        <ArrowUpRight className="p-[5px]" size={25} />
                                                    {/* </Link> */}
                                                </div>
                                        </div>
                                        <p className="text-neutral-900 my-3 text-[12px]">{course.description}</p>
                                    </div>
                                        <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-2">
                                    <Image
                                        src={getFirstTeacher(course.title)}
                                        alt="Teacher"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                    />
                                    <Image
                                        src={getSecTeacher(course.title)}
                                        alt="Mentor"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                    />
                                </div>
                                {/* <p className="text-neutral-900 text-[12px]">4 Jam/Session</p>       */}
                            </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        </div>
                    ))
                }
            </div>
        
        <div className="grid gap-5 grid-cols-1 xl:grid-cols-2">     
            {pkg.type === "INTERMEDIATE" && 
                pkg.courses.map((course) => (
                <div
                    key={course.courseId}
                    className="flex flex-col border-2 rounded-[12px] border-neutral-500 bg-white w-full"
                >
                    <Link href={`/dashboard/class-dashboard/${getSlugByTitle(course.title)}`}>
                    <div className="flex flex-row">
                    <Image
                        src={getImageByTitle(course.title)}
                        alt={course.title}
                        width={165}
                        height={165}
                        className="rounded-l-[10px]"
                    />

                        <div className="flex flex-col mx-5 my-4 justify-between w-full">
                            <div>
                                <div className="flex flex-row justify-between items-center">
                                    <h2 className="text-[14px] font-bold text-neutral-900">{course.title}</h2>
                                        <div className="bg-primary-500 rounded-[5px] self-start">
                                            {/* <Link href={`/dashboard/class-dashboard/${pkg.id}`}> */}
                                            {/* <Link href={`/dashboard/class-dashboard/${getSlugByTitle(course.title)}`}> */}
                                                <ArrowUpRight className="p-[5px]" size={25} />
                                            {/* </Link> */}
                                        </div>
                                </div>
                                <p className="text-neutral-900 my-3 text-[12px]">{course.description}</p>
                            </div>

                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row gap-2">
                                    <Image
                                        src={getFirstTeacher(course.title)}
                                        alt="Teacher"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                    />
                                    <Image
                                        src={getSecTeacher(course.title)}
                                        alt="Mentor"
                                        width={30}
                                        height={30}
                                        className="rounded-full"
                                    />
                                </div>
                                {/* <p className="text-neutral-900 text-[12px]">4 Jam/Session</p>       */}
                            </div>
                        </div>
                    </div>
                    </Link>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
