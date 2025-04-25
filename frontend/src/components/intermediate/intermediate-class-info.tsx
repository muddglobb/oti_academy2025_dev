import React from "react";
import Image from "next/image";
// import MentorCard from "./mentor-card";

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
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[32px] font-bold">
            Detailed Information About Our Class
          </p>
        </div>

        <div>
          <div className="flex gap-6 flex-wrap justify-center">
            {/* <MentorCard
              name="Faris Alamsyah"
              imageUrl="/images/teacher/faris.jpg"
              role="Mentor"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
              linkedin=""
            /> */}
            {/* <MentorCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateClassInfo;
