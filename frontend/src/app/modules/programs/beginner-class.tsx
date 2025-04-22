import Card from "@/components/card";
import React from "react";

const BeginnerClass = () => {
  return (
    <div
      className="     
        w-full
        flex flex-col        
        px-14
        gap-11

        justify-center
      "
    >
      <div>
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[32px] font-bold">
          Beginner Classes to Kickstart Your Journey
        </p>
        <p className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-neutral-50)] to-[var(--color-neutral-400)] text-center text-[18px]">
          Kelas pemula dengan materi esensial buat langkah pertamamu dari{" "}
          <span className="font-bold">1 june - 15 june 2025</span>
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
          // teacher2="/images/teacher/faris.jpg"
          title="Dasar Pemrograman"
          href="https://www.youtube.com/watch?v=chWiR1H_6AY"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi ad cupiditate perferendis corrupti"
        />
      </div>
    </div>
  );
};

export default BeginnerClass;
