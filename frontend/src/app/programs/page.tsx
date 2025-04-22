import React from "react";
import ProgramsHero from "../modules/programs/programs-hero-section";
import ClassBundle from "../modules/programs/class-bundle";
import BeginnerClass from "../modules/programs/beginner-class";
import IntermediateClass from "../modules/programs/intermediate-class";

const Page = () => {
  return (
    <div className="bg-red-500">
      <ProgramsHero></ProgramsHero>
      <div>
        <ClassBundle></ClassBundle>
        <BeginnerClass></BeginnerClass>
        <IntermediateClass></IntermediateClass>
      </div>
    </div>
  );
};

export default Page;
