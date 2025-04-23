import React from "react";
import Card from "@/components/card";
import Image from "next/image";

const ClassBundle = () => {
  return (
    <div
      className="     
      w-full
      h-194
      flex flex-col        
      px-14
      gap-11

      justify-center
      bg-[linear-gradient(0deg,rgba(5,12,26,0.6)_0%,rgba(5,12,26,0.9)_100%)]
      realtive
    "
    >
      <Image
        src="/images/stars-bundle-programs.png"
        alt="stars"
        fill
        className="absolute top-0 left-0 w-full object-cover -z-10"
      ></Image>

      <div>
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[32px] font-bold">
          Get the Best of Both Worlds with Our Class Bundle
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[18px]">
          Tingkatkan kemampuanmu dengan paket belajar pemula hingga intermediate
          dari <span className="font-bold">1 June - 30 June 2025</span>
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-10 justify-center">
        <Card
          type="Beginner"
          image="/images/class-profile/hako.jpg"
          teacher1="/images/teacher/faris.jpg"
          teacher2="/images/teacher/faris.jpg"
          title="Dasar Pemrograman"
          href="https://www.youtube.com/watch?v=chWiR1H_6AY"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti"
        />

        <Card
          type="Beginner"
          image="/images/class-profile/hako.jpg"
          teacher1="/images/teacher/faris.jpg"
          // teacher2="/images/teacher/faris.jpg"
          title="Dasar Pemrograman"
          href="https://www.youtube.com/watch?v=chWiR1H_6AY"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti"
        />

        <Card
          type="Beginner"
          image="/images/class-profile/hako.jpg"
          teacher1="/images/teacher/faris.jpg"
          teacher2="/images/teacher/faris.jpg"
          title="Dasar Pemrograman"
          href="https://www.youtube.com/watch?v=chWiR1H_6AY"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti"
        />

        <Card
          type="Beginner"
          image="/images/class-profile/hako.jpg"
          teacher1="/images/teacher/faris.jpg"
          teacher2="/images/teacher/faris.jpg"
          title="Dasar Pemrograman"
          href="https://www.youtube.com/watch?v=chWiR1H_6AY"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti"
        />
      </div>
    </div>
  );
};

export default ClassBundle;
