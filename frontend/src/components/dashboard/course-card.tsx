import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type CourseCardProps = {
  slug: string | null;
  image: string;
  title: string;
  description: string;
  firstTeacher: string;
  secTeacher: string | null;
};
const CourseCard = ({
  slug,
  image,
  title,
  description,
  firstTeacher,
  secTeacher,
}: CourseCardProps) => {
  return (
    <div className="flex flex-col border-2 rounded-[12px] border-neutral-500 bg-white w-full">
      <Link href={`/dashboard/class-dashboard/${slug}`}>
        <div>
          <div className="flex flex-row">
            <div className="relative w-35 md:w-45 h-auto">
              <Image
                src={image}
                alt={title}
                fill
                className="rounded-l-[10px] object-cover"
              />
            </div>

            <div className="flex flex-col mx-1 sm:mx-5 my-1 sm:my-4 w-full justify-between">
              <div>
                <div className="flex flex-row justify-between items-center">
                  <h2 className="text-[14px] font-bold text-neutral-900">
                    {title.replace(/^Bundle\s*/, "")}
                  </h2>
                  <div className="bg-primary-500 rounded-[5px] self-start">
                    {/* <Link href={`/dashboard/class-dashboard/${pkg.id}`}> */}
                    {/* <Link href={`/dashboard/class-dashboard/${getSlugByTitle(course.title)}`}> */}
                    <ArrowUpRight className="p-[5px]" size={25} />
                    {/* </Link> */}
                  </div>
                </div>
                <p
                  className={`text-neutral-900 my-3 text-[12px] ${
                    title.startsWith("Bundle ")
                      ? "line-clamp-2"
                      : "line-clamp-3"
                  }`}
                >
                  {description}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="hidden sm:flex flex-row gap-2">
                  <Image
                    src={firstTeacher}
                    alt="Teacher"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  {secTeacher !== "" && (
                    <Image
                      src={secTeacher || "/images/class-profile/hako.jpg"}
                      alt="Mentor"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
