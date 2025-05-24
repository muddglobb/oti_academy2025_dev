import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
}

const getBundleMentorPic = (name: string): getBundleMentorPicType => {
    switch (name) {
        case "Bundle Python + Data Science & Artificial Intelligence":
            return {
                TA: "/images/teacher/faris.jpg",
                mentor: "/images/class-profile/hako.jpg",
            }  
        case "Bundle Graphic Design + UI/UX":
            return {
                TA: "/images/teacher/faris.jpg",
                mentor: "/images/class-profile/hako.jpg",
            } 
        case "Bundle Fundamental Cyber Security + Cyber Security":
            return {
                TA: "/images/teacher/faris.jpg",
                mentor: "/images/class-profile/hako.jpg",
            } 
        case "Bundle Web Development + Software Engineering":
            return {
                TA: "/images/teacher/faris.jpg",
                mentor: "/images/class-profile/hako.jpg",
            } 
        default:
            return {
                TA: "/images/teacher/faris.jpg",
                mentor: "/images/class-profile/hako.jpg",
            } 
    }
}

const getBundleDesc = (name: string): string => {
    switch (name) {
        case "Bundle Python + Data Science & Artificial Intelligence":
            return "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti";
        case "Bundle Graphic Design + UI/UX":
            return "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
        case "Bundle Fundamental Cyber Security + Cyber Security":
            return "Contrary to popular belief, Lorem Ipsum is not simply random text.";
        case "Bundle Web Development + Software Engineering":
            return "There are many variations of passages of Lorem Ipsum available.";
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


export default function BundleCard({ pkg , course }: { pkg: PackageType, course: CourseType }) {
  return (    
    <>
      {pkg.type === "BUNDLE" && (
        <div
            key={pkg.id}
            className="flex flex-col border-2 rounded-[12px] border-neutral-500 bg-white"
        >
            <div className="flex flex-row">
            <Image
                src={getBundleImage(pkg.name)}
                alt={pkg.name}
                width={165}
                height={165}
                className="rounded-l-[10px]"
            />

            <div className="flex flex-col mx-5 my-4 justify-between w-full">
                <div>
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-[14px] font-bold text-neutral-900">{pkg.name.replace(/^Bundle\s+/i, '')}</h2>
                            <div className="bg-primary-500 rounded-[5px] self-start">
                                <Link href={`/dashboard/class-dashboard/${pkg.id}`}>
                                    <ArrowUpRight className="p-[5px]" size={25} />
                                </Link>
                            </div>
                    </div>
                    <p className="text-neutral-900 my-3 text-[12px]">{getBundleDesc(pkg.name)}</p>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2">
                        <Image
                            src={getBundleMentorPic(course.title).mentor}
                            alt="Mentor"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <Image
                            src={getBundleMentorPic(course.title).TA}
                            alt="TA"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                    </div>
                    <p className="text-neutral-900 text-[12px]">4 Jam/Session</p>      
                </div>
            </div>
        </div>
        </div>
        )}
    </>
  );
}

