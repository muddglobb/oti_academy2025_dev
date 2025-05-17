import React from "react";
import ProgramsHero from "@/components/programs/programs-hero-section";
import ClassBundle from "@/components/programs/class-bundle";
import BeginnerClass from "@/components/programs/beginner-class";
import IntermediateClass from "@/components/programs/intermediate-class";
// import BeginnerSlider from "./beginner-slider";

const ProgramsPage = () => {
  return (
    <div className="relative overflow-x-hidden">
      <ProgramsHero></ProgramsHero>

      <div>
        <ClassBundle></ClassBundle>
        <BeginnerClass></BeginnerClass>
      </div>

      <IntermediateClass></IntermediateClass>
    </div>
  );
};

export default ProgramsPage;
