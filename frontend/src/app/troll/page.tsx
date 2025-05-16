import React from "react";
import ProgramsHero from "@/app/modules/programs/programs-hero-section";
import ClassBundle from "../modules/programs/class-bundle";
import ProgramsPageBackground from "@/components/programs-page-background";

const page = () => {
  return (
    <div className="overflow-hidden">
      <ProgramsPageBackground />
      <div>
        <ProgramsHero />
        <ClassBundle />
      </div>
    </div>
  );
};

export default page;
