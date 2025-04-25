import React from "react";
import IntermediateHero from "@/components/intermediate/intermediate-hero";
import IntermediateClassInfo from '@/components/intermediate/intermediate-class-info'

const IntermediatePage = () => {
  return (
    <div className="relative overflow-x-hidden">
      <IntermediateHero></IntermediateHero>
      <IntermediateClassInfo />
    </div>
  );
};

export default IntermediatePage;
