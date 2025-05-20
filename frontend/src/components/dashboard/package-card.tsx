import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const getCourseImage = (title: string): string => {
    switch (title) {
        case "Basic Python":
            return "/logo.jpeg";
        case "Graphic Design":
            return "/logo.jpeg";
        case "Competitive Programming":
            return "/logo.jpeg";
        case "Game Development":
            return "/logo.jpeg";
        case "Web Development":
            return "/logo.jpeg";
        case "Fundamental Cyber Security":
            return "/logo.jpeg";
        // intermediate
        case "Software Engineering":
            return "/logo.jpeg";
        case "Data Science & Artificial Intelligence":
            return "/logo.jpeg";
        case "UI/UX":
            return "/logo.jpeg";
        case "Cyber Security":
            return "/logo.jpeg";
        default:
            return "/logo.jpeg";
    }
};

const getBundleImage = (name: string): string => {
    switch (name) {
        case "Bundle Python + Data Science & Artificial Intelligence":
            return "/logo.jpeg";
        case "Bundle Graphic Design + UI/UX":
            return "/images/class-profile/hako.jpg";
        case "Bundle Fundamental Cyber Security + Cyber Security":
            return "/logo.jpeg";
        case "Bundle Web Development + Software Engineering":
            return "/logo.jpeg";
        default:
            return "/images/course-placeholder.jpg";
    }
};

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

const getBundleDesc = (name: string): string => {
    switch (name) {
        case "Bundle Python + Data Science & Artificial Intelligence":
            return "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti";
        case "Bundle Graphic Design + UI/UX":
            return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
        case "Bundle Fundamental Cyber Security + Cyber Security":
            return "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.";
        case "Bundle Web Development + Software Engineering":
            return "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.";
        default:
            return "/images/course-placeholder.jpg";
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


export default function PackageCard({ pkg , course }: { pkg: PackageType, course: CourseType }) {
    if (pkg.type === "BUNDLE") return;
  return (
    <div className="flex flex-col border rounded-lg p-4 mb-4 grid gap-6 grid-cols-2">
        {pkg.type === "ENTRY" && 
            pkg.courses.map((course) => (
            <div
                key={course.courseId}
                className="flex flex-col border rounded-lg shadow-sm bg-white mb-4"
            >
                <div className="border-4 rounded-lg">
                    <div className="flex flex-row">
                    <Image
                        src={getCourseImage(course.title)}
                        alt={course.title}
                        width={200}
                        height={150}
                        className="rounded-l-lg"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                    />

                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                                    <div className="bg-[var(--color-primary-500)] rounded-[5px] self-start">
                                        <Link href={`/dashboard/class-dashboard/${pkg.id}`}>
                                            <ArrowUpRight className="text-[var(--color-neutral-50)] p-[5px]" size={25} />
                                        </Link>
                                    </div>
                            </div>
                            <p className="text-gray-600 mt-2">{course.description}</p>
                            <Image
                                src={getTeacherPic(course.title)}
                                alt="Teacher"
                                width={30}
                                height={30}
                                className="rounded-full mt-4"
                            />      
                        </div>
                    </div>
                    </div>
                </div>
            ))
        }

        {pkg.type === "INTERMEDIATE" && 
            pkg.courses.map((course) => (
            <div
                key={course.courseId}
                className="flex flex-col border rounded-lg p-4 shadow-sm bg-white mb-4"
            >
                <div className="flex flex-row">
                <Image
                    src={getCourseImage(course.title)}
                    alt={course.title}
                    width={200}
                    height={150}
                    className="rounded-md"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                />

                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                                <div className="bg-[var(--color-primary-500)] rounded-[5px] self-start">
                                    <Link href={`/dashboard/class-dashboard/${pkg.id}`}>
                                        <ArrowUpRight className="text-[var(--color-neutral-50)] p-[5px]" size={25} />
                                    </Link>
                                </div>
                        </div>
                        <p className="text-gray-600 mt-2">{course.description}</p>
                        <div className="flex flex-row gap-2">
                            <Image
                                src={getTeacherPic(course.title)}
                                alt="Teacher"
                                width={30}
                                height={30}
                                className="rounded-full mt-4"
                            />
                            <Image
                                src={getMentorPic(course.title)}
                                alt="Mentor"
                                width={30}
                                height={30}
                                className="rounded-full mt-4"
                            />
                        </div>  
                    </div>
                </div>
                </div>
            ))
        }
    </div>
  );
}
