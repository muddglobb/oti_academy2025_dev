import React from "react";
import ProgramsHero from "../modules/programs/programs-hero-section";

const Page = () => {
  return (
    <div>
      <div
        className="
        w-full
        h-[532px]
        bg-[url('/images/background-programs.png')] 
        bg-cover 
        bg-center
        flex
        items-center
        justify-center
      "
      >
        <ProgramsHero></ProgramsHero>
      </div>
    </div>
  );
};

export default Page;
