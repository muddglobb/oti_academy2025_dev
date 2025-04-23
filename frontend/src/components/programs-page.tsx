import React from "react";
import ProgramsHero from "@/app/modules/programs/programs-hero-section";
import ClassBundle from "@/app/modules/programs/class-bundle";
import BeginnerClass from "@/app/modules/programs/beginner-class";
import IntermediateClass from "@/app/modules/programs/intermediate-class";
// import Image from "next/image";

const ProgramsPage = () => {
  return (
    <div className="relative overflow-x-hidden">
      <div>
        <ProgramsHero></ProgramsHero>
        <div>
          <div>
            <ClassBundle></ClassBundle>
            <BeginnerClass></BeginnerClass>
            
          </div>

          <IntermediateClass></IntermediateClass>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
