import React from "react";
import Image from "next/image";
import MentorCard from "./mentor-card";
import {Calendar, Target, Clock, CircleAlert, Database} from "lucide-react";

const IntermediateClassInfo = () => {
  return (
    <div
      className="
        w-full
        h-216

        bg-cover 
        bg-center
        flex
        flex-col
        items-center
        justify-center
        
        bg-[linear-gradient(0deg,rgba(5,12,26,0.5)_0%,rgba(5,12,26,1.0)_100%)]
        relative
      "
    >
      <div className="flex-col items-center justify-center">
        <Image
          src="/images/class-info-background.png"
          alt="stars"
          fill
          className="absolute top-0 left-0 w-full object-cover -z-10"
        />

        <div>
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[32px] font-bold mb-7.5">
            Detailed Information About Our Class
          </p>
        </div>

        <div>
          <div className="flex gap-6 flex-wrap justify-center mb-6">
            <MentorCard
              name="Faris Alamsyah"
              imageUrl="/images/teacher/faris.jpg"
              role="Mentor"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
              linkedin="https://www.linkedin.com/in/dhimas-sulistio/"
            />
            
            <MentorCard
              name="Hafidz Wahfi"
              imageUrl="/images/class-profile/hako.jpg"
              role="Teaching Assistant"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
              linkedin="https://www.linkedin.com/in/dhimas-sulistio/"
            />
          </div>


          <div className="text-white flex flex-col gap-2.5 w-auto">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5 lg:flex-col">
                <div className="flex gap-2.5 border-2 p-2 rounded-[8px] w-[50%] lg:w-full">
                  <Calendar />
                  <p>tanggal</p>
                </div>
                <div className="flex gap-2.5 border-2 p-2 rounded-[8px] w-[50%] lg:w-full">
                  <Target />
                  <p>sesi</p>
                </div>
              </div>
              <div className="flex gap-2.5 lg:flex-col">
                <div className="flex gap-2.5 border-2 p-2 rounded-[8px] w-[50%] lg:w-full">
                  <Clock />
                  <p>jam</p>
                </div>
                <div className="flex gap-2.5 border-2 p-2 rounded-[8px] w-[50%] lg:w-full">
                  <Database />
                  <p>modul</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 border-2 p-2 rounded-[8px]">
              <CircleAlert />
              <p>prerequisites</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default IntermediateClassInfo;
