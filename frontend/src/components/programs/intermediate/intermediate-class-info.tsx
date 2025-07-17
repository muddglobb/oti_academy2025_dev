import React from "react";
// import Image from "next/image";
import MentorCard from "./mentor-card";
import { Calendar, Target, Clock, CircleAlert, Database } from "lucide-react";
import TBACard from "./tba-mentor";

type ClassInfoProps = {
  classInfo: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ];
};
const IntermediateClassInfo = ({ classInfo }: ClassInfoProps) => {
  const [
    mentor,
    mentorImage,
    mentorDesc,
    mentorLink,
    TA,
    TAImage,
    TADesc,
    TALink,
    date,
    session,
    hour,
    modul,
    prerequisites,
  ] = classInfo;
  return (
    <div
      className="
        relative w-full overflow-hidden bg-[linear-gradient(0deg,rgba(5,12,26,0.8)_0%,rgba(5,12,26,0.2)_100%)]
      "
    >
      <div
        className="absolute inset-0 bg-repeat bg-center -z-10"
        style={{ backgroundImage: "url('/images/space-background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/10 to-neutral-900/50 -z-20"></div>
      </div>
      <div
        className="absolute w-3/4 h-3/4 top-2 right-0 bg-right -mr-[30%] bg-contain bg-no-repeat -z-10 scale-x-[-1] rotate-[-35deg] brightness-40 "
        style={{ backgroundImage: "url(/images/planet/saturnus.png)" }}
      ></div>
      <div className="flex-col items-center justify-center py-10">
        <div className="px-4">
          <p
            className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center font-bold mb-7.5
          text-[22px]
          sm:text-[26px]
          md:text-[30px]
          lg:text-[32px]
          "
          >
            Detailed Information About Our Class
          </p>
        </div>

        <div className="px-4">
          <div className="flex gap-6 flex-wrap justify-center mb-6">
            {/* sementara tidak dipakai
            <MentorCard
              name={mentor}
              imageUrl={mentorImage}
              role="Mentor"
              description={mentorDesc}
              linkedin={mentorLink}
            /> */}
            {/* <TBACard
              name="Mentor"
              imageUrl="/images/foto-orang/mentor-tba.webp"
              description="To Be Announced"
            /> */}
            <MentorCard
              name={mentor}
              imageUrl={mentorImage}
              role="Mentor"
              description={mentorDesc}
              linkedin={mentorLink}
            />
            {mentor === "Ach Rozikin" && (
              <MentorCard
              name="Ilham Bachtiar Irfani"
              imageUrl="/images/foto-orang/mentor-dsai-2.webp"
              role="Mentor"
              description="Senior AI Engineer and Founding Team of Sarana AI."
              linkedin={mentorLink}
            />
            )}

            <MentorCard
              name={TA}
              imageUrl={TAImage}
              role="Teaching Assistant"
              description={TADesc}
              linkedin={TALink}
            />
          </div>

          <div
            className="text-white flex flex-col gap-2.5 w-auto
            px-0
            md:px-15
            lg:px-46
            xl:px-108
            text-[12px]
            md:text-[14px]
          "
          >
            <div className="flex flex-col gap-2.5 items-center">
              <div className="flex gap-2.5 border-2 p-2 rounded-[8px] items-center w-91 md:w-155">
                <Calendar size={18} />
                {/* <p>tanggal</p> */}
                <p>{date}</p>
              </div>
              <div className="flex gap-2.5 border-2 p-2 rounded-[8px] items-center w-91 md:w-155">
                <Target size={18} />
                {/* <p>sesi</p> */}
                <p>{session}</p>
              </div>
              <div className="flex gap-2.5 border-2 p-2 rounded-[8px] items-center w-91 md:w-155">
                <Clock size={18} />
                {/* <p>jam</p> */}
                <p>{hour}</p>
              </div>
              <div className="flex gap-2.5 border-2 p-2 rounded-[8px] items-center w-91 md:w-155">
                <Database size={18} />
                {/* <p>modul</p> */}
                <p>{modul}</p>
              </div>
              <div className="flex gap-2.5 border-2 p-2 rounded-[8px] items-center w-91 md:w-155">
                <CircleAlert size={18} />
                {/* <p>prerequisites</p> */}
                <p>{prerequisites}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateClassInfo;
