import React from "react";
import Image from "next/legacy/image";
import MentorCard from "@/components/programs/intermediate/mentor-card";
import TBACard from "../intermediate/tba-mentor";

type BundleClassInfoProps = {
  date: string;
  sesi: string;
  jam: string;
  modul: string;
  mentor: string;
  mentorImage: string;
  mentorDesc: string;
  mentorLink: string;
  TA: string;
  TAImage: string;
  TALink: string;
  TADesc: string;
  title: string;
};

const BundleClassInfo = ({
  date,
  sesi,
  jam,
  modul,
  mentor,
  mentorImage,
  mentorDesc,
  mentorLink,
  TA,
  TAImage,
  TALink,
  TADesc,
  title,
}: BundleClassInfoProps) => {
  return (
    <>
      <div className="relative w-full overflow-hidden bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]">
        <div
          className="absolute inset-0 bg-repeat bg-center -z-10"
          style={{ backgroundImage: "url('/images/space-background.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/10 to-neutral-900/50 -z-20"></div>
        </div>
        <div
          className="absolute w-3/4 h-3/4 top-2 right-0 bg-right -mr-[30%]   bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-40"
          style={{ backgroundImage: "url(/images/planet/saturnus.png)" }}
        ></div>
        <section className="flex flex-col gap-7.5  justify-center items-center py-10 bg-no-repeat bg-cover w-full">
          <p
            className="text-center font-bold bg-gradient-to-b from-gray-300 to-gray-400 bg-clip-text text-transparent
          text-[22px]
          sm:text-[26px]
          md:text-[30px]
          lg:text-[32px]"
          >
            Detailed Information About Our Class
          </p>
          <div className="md:w-4xl w-sm">
            <div className="flex flex-col justify-center md:gap-x-8 gap-y-8">
              <div className="flex gap-6 flex-wrap justify-center mb-6 px-2">
                {/* SEMENTARA GA DIPAKAI
                <MentorCard
                  name={mentor}
                  imageUrl={mentorImage}
                  role="Mentor"
                  description={mentorDesc}
                  linkedin={mentorLink}
                /> */}
                <TBACard
                  name="Mentor"
                  imageUrl="/images/foto-orang/mentor-tba.webp"
                  description="To Be Announced"
                />

                <MentorCard
                  name={TA}
                  imageUrl={TAImage}
                  role="Teaching Assistant"
                  description={TADesc}
                  linkedin={TALink}
                />
                {/* Ken Bima Satria Gandasasmita */}
                {title == "Graphic Design + UI/UX" && (
                  <MentorCard
                    name="Ken Bima Satria Gandasasmita"
                    imageUrl="/images/foto-orang/ken-bima.webp"
                    role="Teaching Assistant"
                    description="Mahasiswa Ilmu Komputer UGM dengan spesialisasi dan berpengalaman dalam berbagai kompetisi  UI/UX termasuk menjadi finalis GEMASTIK 2024. Ia siap berbagi ilmu dan jadi teaching assistant."
                    linkedin="https://www.linkedin.com/in/kenbimasatriagandasasmita/"
                  />
                )}
              </div>

              <div className="text-sm text-white flex flex-col gap-2 justify-center items-center w-full">
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-91 px-2.5 py-2">
                  <Image
                    src={"/icons/calendar-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{date}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-91 px-2.5 py-2">
                  <Image
                    src={"/icons/target-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{sesi}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-91 px-2.5 py-2">
                  <Image
                    src={"/icons/time-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{jam}</p>
                </div>
                <div className="flex flex-row gap-2.5 border-s-white border-2 rounded-lg w-91 px-2.5 py-2">
                  <Image
                    src={"/icons/stack-icon.svg"}
                    alt="calendar-icon"
                    width={21}
                    height={21}
                  ></Image>
                  <p>{modul}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BundleClassInfo;
