import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  getShortDescByTitle,
  getImageByTitle,
  getSlugByTitle,
} from "@/lib/course-props/course-props";
import { Elsie_Swash_Caps } from "next/font/google";

type CardProps = {
  type: string;
  image: string;
  teacher1: string;
  teacher2?: string;
  title: string;
  bundleTitle: string;
  href: string;
  description: string;
};

const Card = ({
  type,
  image,
  teacher1,
  teacher2,
  title,
  bundleTitle,
  href,
  description,
}: CardProps) => {
  return (
    // <div className="bg-[var(--color-neutral-50)] rounded-[10px] overflow-hidden w-[297px]">
    //   <Link href={href}>
    //     <div className="relative w-[100%] h-[284px]">
    //       <Image src={image} alt={title} layout="fill" objectFit="cover" />

    //       <div className="absolute top-0 left-0 h-[284px] flex flex-col justify-between w-[100%] p-[20px]">
    //         <div>
    //           <p className="inline-block text-[var(--color-neutral-50)] bg-[var(--color-primary-500)] px-4 py-1 rounded-[5px]">
    //             {type}
    //           </p>
    //         </div>

    //         <div className="w-[100%] flex items-center justify-between">
    //           <div>
    //             <div className="flex items-center gap-[10px]">
    //               <Image
    //                 src={teacher1}
    //                 alt="Teacher 1"
    //                 width={29}
    //                 height={29}
    //                 className="rounded-full"
    //               />
    //               {teacher2 && (
    //                 <Image
    //                   src={teacher2}
    //                   alt="Teacher 2"
    //                   width={29}
    //                   height={29}
    //                   className="rounded-full"
    //                 />
    //               )}
    //             </div>
    //           </div>

    //           <p className="text-[14px] text-neutral-50">2 Jam/Sesi</p>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="p-[20px] h-66 justify-between">
    //       {/* <div className="flex justify-between"> */}
    //       <div className="flex justify-between">
    //         <p className="font-bold text-[18px] w-[95%]">{title}</p>
    //         <div className="bg-[var(--color-primary-500)] rounded-[5px] self-start">
    //           {/* <Link href={href}> */}
    //           <ArrowUpRight
    //             className="text-[var(--color-neutral-50)] p-[5px]"
    //             size={25}
    //           />
    //           {/* </Link> */}
    //         </div>
    //       </div>

    //       <p className="text-[12px] mt-1 text-justify">{description}</p>
    //     </div>
    //   </Link>
    // </div>
    <div>
      <Link href={`/programs/${getSlugByTitle(title)}`}>
        <div className="bg-white rounded-md h-full">
          <div>
            {/* <div className="p-5 h-82 bg-black rounded-t-md bg-[url('/images/teacher/faris.jpg')] bg-center bg-contain bg-no-repeat"> */}
            <div
              className="p-5 h-76 bg-black rounded-t-md bg-center bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${getImageByTitle(title)})`,
              }}
            >
              <div className="text-white font-bold text-sm bg-primary-500 inline-block px-3 py-1 rounded">
                {type}
              </div>
            </div>
          </div>

          <div className="p-5 h-50">
            <div className="flex justify-between gap-4">
              {type == "Bundle" && (
                <p className="font-bold text-black w-full">{bundleTitle}</p>
              )}
              {type != "Bundle" && (
                <p className="font-bold text-black w-full">{title}</p>
              )}
              {/* <Link href={`/dashboard/class-dashboard/${course.id}`}> */}

              <button className="bg-primary-500 p-1 rounded self-start cursor-pointer">
                <ArrowUpRight className="text-white" />
              </button>
            </div>
            <div className="text-sm text-gray-600 mt-2 text-justify">
              {/* {course.description} */}
              {getShortDescByTitle(title)}
            </div>
            <div />
          </div>
          {/* </Link> */}
        </div>
      </Link>
    </div>
  );
};

export default Card;
