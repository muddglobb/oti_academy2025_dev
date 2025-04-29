import React from "react";
import IntermediateHero from "@/components/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/intermediate/intermediate-session-info";

const sessions: [string, string, string, string][] = [
  ["Session 1", 
    "1 June 2025", 
    "2 - 4 Jam/Sessions", 
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi"
  ],
  ["Session 1", 
    "1 June 2025", 
    "2 - 4 Jam/Sessions", 
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi"
  ],
  ["Session 1", 
    "1 June 2025", 
    "2 - 4 Jam/Sessions", 
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi"
  ],
];
const IntermediatePage = () => {
  return (
    <div className="relative overflow-x-hidden">
      <IntermediateHero></IntermediateHero>
      <IntermediateClassInfo />
      <IntermediateSessionInfo sessions={sessions}/>
    </div>
  );
};

export default IntermediatePage;
