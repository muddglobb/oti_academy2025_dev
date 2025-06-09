import React from "react";
import Image from "next/image";
import Link from "next/link";
// import { Linkedin } from "lucide-react";

type MentorCardProps = {
  name: string;
  role: string;
  linkedin: string;
  imageUrl: string;
  description: string;
};
const MentorCard = ({
  name,
  role,
  imageUrl,
  description,
  linkedin,
}: MentorCardProps) => {
  return (
    <div>
      <div
        className="
      md:flex
      sm:flex-row 
      sm:w-100

      md:flex-col
      md:w-75
      md:h-108
    bg-white rounded-lg
    hidden"
      >
        <div
          className="
        
        h-auto
        min-h-52
        

        sm:w-60
        sm:h-80
        sm:min-h-60

        md:w-75 
        md:h-[284px] 
        md:mask-b-from-90%
        md:mask-r-from-100%
        rounded-lg  
        bg-cover
        "
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="m-5">
            <div
              className="
            text-white 
              gap-1 
              hidden
              md:flex 
              md:justify-between
          "
            >
              <div className="w-auto max-w-[80%]">
                <div className="font-bold h-auto w-auto">
                  <p className="bg-primary-800 rounded-[5px] text-[22px] p-1 break-words">
                    {name}
                  </p>
                </div>
                <div className="inline-block">
                  <p className="bg-primary-800 rounded-[5px] text-[12px] p-1 mt-0.5">
                    {role}
                  </p>
                </div>
              </div>

              <Link href={linkedin}>
                <Image
                  src={"/icons/linkedin-icon.svg"}
                  alt="linkedin-icon"
                  width={35}
                  height={35}
                  className="bg-primary-50 rounded-[5px] mt-0 p-[5px] cursor-pointer"
                />
                {/* <Linkedin size={30} className="bg-primary-50 p-5 rounded-[5px]" color="#000"/> */}
              </Link>
              {/* <button className="w-[30px] h-[30px]">
              <Image
                src={"/icons/linkedin-icon.svg"}
                alt="linkedin-icon"
                width={30}
                height={30}
                className="bg-primary-50 rounded-[5px] mt-0 p-[5px] border-s-white border-[1px] "
              />
            </button> */}
            </div>
          </div>
        </div>

        <div
          className="
          md:w-auto
      "
        >
          <div className="flex justify-between p-3 md:hidden">
            <div className="text-[var(--color-neutral-50)] w-auto max-w-[75%]">
              <div className="font-bold h-auto">
                <p className="bg-primary-800 rounded-[5px] text-[18px] p-1 break-words">
                  {name}
                </p>
              </div>
              <div className="inline-block">
                <p className="bg-primary-800 rounded-[5px] text-[12px] p-1 mt-0.5">
                  {role}
                </p>
              </div>
            </div>

            {/* <Link href="https://www.linkedin.com/in/dhimas-putra-sulistio-bbb3b1244/"> */}
            <button className="w-[21px] h-[21px] cursor-pointer">
              <Link href={linkedin}>
                <Image
                  src={"/icons/linkedin-icon.svg"}
                  alt="linkedin-icon"
                  width={26}
                  height={26}
                  className="bg-primary-50 rounded-[5px] mt-0 p-[5px] cursor-pointer"
                />
              </Link>
            </button>
            {/* </Link> */}
          </div>

          <p className="flex m-4 text-xs items-end">{description}</p>
        </div>
      </div>

      <div className="md:hidden flex ">
        <Image
          src={imageUrl}
          alt="person-placeholder"
          width={200}
          height={200}
          className="rounded-l-md"
        />
        <div className="bg-neutral-50 w-42 rounded-r-md h-50">
          <div className="m-2">
            <div className="flex justify-between">
              <div className="mr-2">
                <div>
                  <p className="text-[14px] font-bold text-neutral-50 bg-primary-800 inline-block p-1 rounded-sm">
                    {name}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-neutral-50 bg-primary-800 inline-block p-1 rounded-sm">
                    {role}
                  </p>
                </div>
              </div>
              <button className="w-8 h-8 cursor-pointer">
                <Link href={linkedin}>
                  <Image
                    src={"/icons/linkedin-icon.svg"}
                    alt="linkedin-icon"
                    width={26}
                    height={26}
                    className="bg-primary-50 rounded-[5px] mt-0 p-[5px] cursor-pointer"
                  />
                </Link>
              </button>
            </div>

            <div>
              {/* <p>{description}</p> */}
              <p className="text-sm line-clamp-5">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
