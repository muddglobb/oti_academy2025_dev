import React from "react";
import BundleClassInfo from "@/components/bundle/bundle-classinfo";
import Hero from "@/components/intermediate/intermediate-hero";
// import BundleSessionInfo from "@/components/bundle/bundle-sessioninfo";
import SessionInfo from "@/components/intermediate/intermediate-session-info";

const hero: [string, string] = [
  "Web Development + Software Engineering",
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
];
const sessions: [string, string, string, string][] = [
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
  [
    "Session 1",
    "1 June 2025",
    "2 - 4 Jam/Sessions",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis?",
  ],
];
const bundle = () => {
  return (
    <>
      <div>
        <Hero hero={hero} />
        <BundleClassInfo
          date="1 - 15 June 2025"
          sesi="6 Sesi"
          jam="2 Jam/Sesi"
          modul="10 Modul"
          mentor="Dhimas Putra"
          mentorImage="/person-placeholder.jpeg"
          mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          mentorLink="https://www.linkedin.com"
          TA="Dhimas Putra"
          TAImage="/person-placeholder.jpeg"
          TADesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
          TALink="https://www.linkedin.com"
        ></BundleClassInfo>

        <SessionInfo sessions={sessions} />
      </div>
    </>
  );
};

export default bundle;
