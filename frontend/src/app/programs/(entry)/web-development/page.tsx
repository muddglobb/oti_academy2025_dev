import React from "react";
import EntryClassInfo from "@/components/entry/entry-classinfo";
// import EntryHero from "@/components/entry/entry-hero";
import Hero from "@/components/intermediate/intermediate-hero";
// import EntrySessionInfo from "@/components/entry/entry-sessioninfo";
import SessionInfo from "@/components/intermediate/intermediate-session-info";

const hero: [string, string] = [
  "Web Development",
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veritatis rem dolore officia suscipit non consequatur odit id a repudiandae nobis? fjieofjiojwjefoiejwoi",
];
const classInfo: [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
] = [
  "1 - 15 June 2025",
  "6 Sesi",
  "2 Jam/Sesi",
  "10 Modul",
  "Dhimas Putra",
  "/person-placeholder.jpeg",
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?",
  "https://www.linkedin.com",
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
];
const webDevelopment = () => {
  return (
    <div className="flex flex-col items-center">
      {/* <EntryHero
        className="Web Development"
        classDescription="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa harum accusamus quos incidunt vero sed iusto tempora similique, dignissimos reprehenderit dicta amet voluptate, ducimus ex rem aliquam, molestiae commodi sapiente."
      ></EntryHero> */}
      {/* <EntryHero hero={hero} /> */}
      <Hero hero={hero}/>
      {/* <EntryClassInfo
        date="1 - 15 June 2025"
        sesi="6 Sesi"
        jam="2 Jam/Sesi"
        modul="10 Modul"
        mentor="Dhimas Putra"
        mentorImage="/person-placeholder.jpeg"
        mentorDesc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi suscipit ipsam tenetur temporibus atque velit laudantium animi unde eum cum?"
        mentorLink="https://www.linkedin.com"
      /> */}
      <EntryClassInfo classInfo={classInfo} />

      <SessionInfo sessions={sessions}/>
    </div>
  );
};

export default webDevelopment;
