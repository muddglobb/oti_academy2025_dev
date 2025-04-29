import React from "react";
import IntermediateHero from "@/components/intermediate/intermediate-hero";
import IntermediateClassInfo from "@/components/intermediate/intermediate-class-info";
import IntermediateSessionInfo from "@/components/intermediate/intermediate-session-info";

const hero:[string, string] = [
  "Software Engineering",
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
];
const classInfo: [string, string, string, string, string, string, string, string, string, string, string, string, string] = [
  "Faris Alamsyah",
  "/images/teacher/faris.jpg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "Hafidz Wahfi",
  "/images/class-profile/hako.jpg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com/in/dhimas-sulistio/",

  "1 - 15 Juni 2025",
  "6 Sesi",
  "2 - 4 Jam/Sesi",
  "10 Modul",
  "Prerequisite",
]
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
      <IntermediateHero hero={hero} />
      <IntermediateClassInfo classInfo={classInfo}/>
      <IntermediateSessionInfo sessions={sessions}/>
    </div>
  );
};

export default IntermediatePage;
